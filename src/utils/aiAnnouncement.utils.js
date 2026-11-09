import { eventGroups } from '../configs/organizations';
import { ANNOUNCEMENT_TYPES, resolveAnnouncementType } from './announcements.utils';
import { functions } from './firebase.utils';

const MAX_IMAGE_DIMENSION = 1400;
const JPEG_QUALITY = 0.82;
export const PROGRAM_DESCRIPTION_MAX = 120;

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Strip tags/entities to plain text for program-message length checks. */
export const htmlToPlainText = (html = '') => {
  const withBreaks = String(html)
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|h[1-6]|tr)\s*>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '• ');

  const withoutTags = withBreaks.replace(/<[^>]+>/g, ' ');
  const decoded = withoutTags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  return decoded
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
};

/**
 * If the website message already fits the program blurb limit, return it as-is.
 * Otherwise return null so callers can ask AI to summarize.
 */
export const programDescriptionFromMessage = (messageHtml = '') => {
  const plain = htmlToPlainText(messageHtml);
  if (!plain) return null;
  if (plain.length > PROGRAM_DESCRIPTION_MAX) return null;
  return plain;
};

const BULLET_LINE = /^(?:[-*•]|\d+[.)])\s+(.+)$/;

const isBulletLine = (line = '') => BULLET_LINE.test(line.trim());

const bulletText = (line = '') => line.trim().replace(BULLET_LINE, '$1').trim();

/** Convert pasted/AI plain text into HTML, preserving lists. */
export const plainTextToMessageHtml = (text = '') => {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    const paragraph = paragraphLines.join('\n').trim();
    paragraphLines = [];
    if (!paragraph) return;
    blocks.push(`<p>${escapeHtml(paragraph).replace(/\n/g, '<br/>')}</p>`);
  };

  const flushList = () => {
    if (!listItems.length) return;
    const items = listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    blocks.push(`<ul>${items}</ul>`);
    listItems = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushParagraph();
      return;
    }

    if (isBulletLine(trimmed)) {
      flushParagraph();
      listItems.push(bulletText(trimmed));
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushList();
  flushParagraph();

  return blocks.join('');
};

export const normalizeAnnouncementDraft = (raw = {}, { groups = eventGroups } = {}) => {
  const type = resolveAnnouncementType({
    type: raw.type === ANNOUNCEMENT_TYPES.ANNOUNCEMENT ? ANNOUNCEMENT_TYPES.ANNOUNCEMENT : ANNOUNCEMENT_TYPES.EVENT,
  });
  const group = groups.includes(raw.group) ? raw.group : '';
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const message = typeof raw.message === 'string' ? raw.message.trim() : '';
  const description =
    typeof raw.description === 'string' ? raw.description.trim().slice(0, PROGRAM_DESCRIPTION_MAX) : '';
  const startDate = typeof raw.startDate === 'string' ? raw.startDate.trim() : '';
  const endDate = typeof raw.endDate === 'string' ? raw.endDate.trim() : '';
  const time = typeof raw.time === 'string' ? raw.time.trim() : '';
  const qrLink = typeof raw.qrLink === 'string' ? raw.qrLink.trim() : '';
  const qrTitle = typeof raw.qrTitle === 'string' ? raw.qrTitle.trim().slice(0, 30) : '';

  return {
    type,
    title,
    group,
    description,
    message,
    messageHtml: plainTextToMessageHtml(message),
    startDate: type === ANNOUNCEMENT_TYPES.ANNOUNCEMENT ? '' : startDate,
    endDate,
    time: type === ANNOUNCEMENT_TYPES.ANNOUNCEMENT ? '' : time,
    qrLink,
    qrTitle,
  };
};

export const draftToFormEvent = (draft) => {
  const normalized = normalizeAnnouncementDraft(draft);

  return {
    title: normalized.title,
    group: normalized.group,
    type: normalized.type,
    description: normalized.description,
    message: normalized.messageHtml,
    startDate: normalized.startDate,
    endDate: normalized.endDate,
    time: normalized.time,
    qrLink: normalized.qrLink,
    qrTitle: normalized.qrTitle,
  };
};

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image.'));
    };
    image.src = url;
  });

export const fileToCompressedImagePayload = async (file) => {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  const [, imageBase64 = ''] = dataUrl.split(',');

  if (!imageBase64) {
    throw new Error('Could not prepare that image.');
  }

  return {
    imageBase64,
    mimeType: 'image/jpeg',
  };
};

export const parseAnnouncementDraft = async ({ text = '', imageBase64 = '', mimeType = '' } = {}) => {
  if (!functions) {
    throw new Error('AI drafting is not available yet.');
  }

  const callable = functions.httpsCallable('parseAnnouncementDraft');
  const result = await callable({ text, imageBase64, mimeType });
  return normalizeAnnouncementDraft(result?.data ?? {});
};

export const summarizeProgramDescription = async (message = '') => {
  if (!functions) {
    throw new Error('AI drafting is not available yet.');
  }

  const callable = functions.httpsCallable('summarizeProgramDescription');
  const result = await callable({ message });
  const description = typeof result?.data?.description === 'string' ? result.data.description.trim() : '';
  return description.slice(0, PROGRAM_DESCRIPTION_MAX);
};
