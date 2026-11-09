const { initializeApp } = require('firebase-admin/app');
const functions = require('firebase-functions/v1');
const OpenAI = require('openai');

initializeApp();

const EVENT_GROUPS = [
  'Stake',
  'Neighborhood',
  'Ward',
  'Relief Society',
  'Elders Quorum',
  'Combined YM/YW',
  'Young Women',
  'Young Men',
  'Primary',
];

const MAX_TEXT_CHARS = 8000;
const MAX_IMAGE_CHARS = 3_500_000;
const PROGRAM_DESCRIPTION_MAX = 120;

const SYSTEM_PROMPT = `You extract church ward announcement or event details from a flyer image and/or pasted text.

Return ONLY a JSON object with these keys:
- type: "event" or "announcement"
- title: string
- group: one of ${JSON.stringify(EVENT_GROUPS)} or "" if unsure
- startDate: "YYYY-MM-DD" or "" (events with a date range use this; single-day events leave "")
- endDate: "YYYY-MM-DD" (ALWAYS required — for events use the event day; for announcements use the show-until / deadline day)
- time: "h:mm a" like "7:00 pm" or "" if all-day / unknown / announcement
- message: full website message as plain text. Use blank lines between paragraphs. For lists, put each item on its own line starting with "- "
- description: sacrament-program blurb — a brief rewrite of the message for a printed program (see rules)
- qrLink: URL if clearly present, else ""
- qrTitle: short QR label if clearly present, else ""

Rules:
- type "event" = happens on a specific day or date range
- type "announcement" = ongoing notice / signup / ask that stays up until an end date (no single event day)
- Infer type from the content; prefer announcement when the flyer is mainly a deadline or ongoing ask
- Always propose endDate. If only one date is present for an event, put it in endDate and leave startDate empty
- For a multi-day event, startDate is the first day and endDate is the last day
- Prefer factual extraction over invention; leave uncertain optional fields empty
- Today-ish relative phrases should become concrete YYYY-MM-DD dates when possible using the provided "today" value
- group must be exact match from the allowed list or ""
- description MUST be a concise paraphrase members can skim in a sacrament program: who/what/when/where essentials only
- description MUST be at most ${PROGRAM_DESCRIPTION_MAX} characters, complete sentences only, never cut off mid-word or mid-thought, and never end with "..."
- Do not copy the full message into description; summarize it`;

const PROGRAM_SUMMARY_PROMPT = `You write short sacrament-program blurbs for a church ward bulletin.

Given a full announcement message, return ONLY JSON: { "description": "..." }

Rules for description:
- Brief, to the point, easy to skim while reading a printed program
- Include only essentials (what, when, where) — skip song lists, long asks, and extra detail
- At most ${PROGRAM_DESCRIPTION_MAX} characters
- Complete sentence(s) only — never truncate mid-word or mid-thought
- Never end with "..." or an ellipsis
- Plain text only, no HTML`;

const buildUserContent = ({ text, imageBase64, mimeType, today }) => {
  const parts = [
    {
      type: 'text',
      text: `Today is ${today}. Extract announcement/event fields from the following input.`,
    },
  ];

  if (text) {
    parts.push({
      type: 'text',
      text: `Pasted text / description:\n${text}`,
    });
  }

  if (imageBase64 && mimeType) {
    parts.push({
      type: 'image_url',
      image_url: {
        url: `data:${mimeType};base64,${imageBase64}`,
      },
    });
  }

  return parts;
};

const fitProgramDescription = (value = '') => {
  const cleaned = String(value).replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  if (cleaned.length <= PROGRAM_DESCRIPTION_MAX) return cleaned;

  const slice = cleaned.slice(0, PROGRAM_DESCRIPTION_MAX);
  const sentenceEnd = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  if (sentenceEnd > 40) return slice.slice(0, sentenceEnd + 1).trim();

  const wordEnd = slice.lastIndexOf(' ');
  return (wordEnd > 40 ? slice.slice(0, wordEnd) : slice).trim();
};

const stripHtml = (value = '') =>
  String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

const normalizeDraft = (raw = {}) => {
  const type = raw.type === 'announcement' ? 'announcement' : 'event';
  const group = EVENT_GROUPS.includes(raw.group) ? raw.group : '';
  const startDate = typeof raw.startDate === 'string' ? raw.startDate.trim() : '';
  const endDate = typeof raw.endDate === 'string' ? raw.endDate.trim() : '';
  const time = typeof raw.time === 'string' ? raw.time.trim() : '';
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const message = typeof raw.message === 'string' ? raw.message.trim() : '';
  const description =
    typeof raw.description === 'string' ? fitProgramDescription(raw.description) : '';
  const qrLink = typeof raw.qrLink === 'string' ? raw.qrLink.trim() : '';
  const qrTitle = typeof raw.qrTitle === 'string' ? raw.qrTitle.trim().slice(0, 30) : '';

  return {
    type,
    title,
    group,
    startDate: type === 'announcement' ? '' : startDate,
    endDate,
    time: type === 'announcement' ? '' : time,
    message,
    description,
    qrLink,
    qrTitle,
  };
};

const requireOpenAi = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new functions.https.HttpsError('failed-precondition', 'OpenAI is not configured.');
  }
  return new OpenAI({ apiKey });
};

exports.parseAnnouncementDraft = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '512MB',
    secrets: ['OPENAI_API_KEY'],
  })
  .region('us-west1')
  .https.onCall(async (data) => {
    const text = typeof data?.text === 'string' ? data.text.trim() : '';
    const imageBase64 = typeof data?.imageBase64 === 'string' ? data.imageBase64.replace(/\s/g, '') : '';
    const mimeType = typeof data?.mimeType === 'string' ? data.mimeType.trim() : '';

    if (!text && !imageBase64) {
      throw new functions.https.HttpsError('invalid-argument', 'Provide flyer image and/or pasted text.');
    }

    if (text.length > MAX_TEXT_CHARS) {
      throw new functions.https.HttpsError('invalid-argument', 'Pasted text is too long.');
    }

    if (imageBase64 && imageBase64.length > MAX_IMAGE_CHARS) {
      throw new functions.https.HttpsError('invalid-argument', 'Image is too large. Try a smaller photo.');
    }

    if (imageBase64 && !/^image\/(jpeg|jpg|png|webp|gif)$/i.test(mimeType)) {
      throw new functions.https.HttpsError('invalid-argument', 'Unsupported image type.');
    }

    const openai = requireOpenAi();
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Denver' });

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.2,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: buildUserContent({ text, imageBase64, mimeType, today }),
          },
        ],
      });
    } catch (error) {
      console.error('OpenAI parseAnnouncementDraft failed', error?.message || error);
      throw new functions.https.HttpsError('internal', 'AI draft failed. You can fill the form manually.');
    }

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new functions.https.HttpsError('internal', 'AI returned an empty draft.');
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new functions.https.HttpsError('internal', 'AI returned an invalid draft.');
    }

    return normalizeDraft(parsed);
  });

exports.summarizeProgramDescription = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '256MB',
    secrets: ['OPENAI_API_KEY'],
  })
  .region('us-west1')
  .https.onCall(async (data) => {
    const message = typeof data?.message === 'string' ? data.message.trim() : '';
    if (!message) {
      throw new functions.https.HttpsError('invalid-argument', 'Provide a message to summarize.');
    }

    if (message.length > MAX_TEXT_CHARS) {
      throw new functions.https.HttpsError('invalid-argument', 'Message is too long.');
    }

    const openai = requireOpenAi();
    const plainMessage = stripHtml(message);

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.2,
        messages: [
          { role: 'system', content: PROGRAM_SUMMARY_PROMPT },
          {
            role: 'user',
            content: `Write a sacrament-program blurb (max ${PROGRAM_DESCRIPTION_MAX} characters) for:\n\n${plainMessage}`,
          },
        ],
      });
    } catch (error) {
      console.error('OpenAI summarizeProgramDescription failed', error?.message || error);
      throw new functions.https.HttpsError('internal', 'Could not update the program message.');
    }

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new functions.https.HttpsError('internal', 'AI returned an empty program message.');
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new functions.https.HttpsError('internal', 'AI returned an invalid program message.');
    }

    return {
      description: fitProgramDescription(parsed.description || ''),
    };
  });
