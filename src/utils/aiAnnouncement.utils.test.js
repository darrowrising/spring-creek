import { describe, expect, it, vi } from 'vitest';

vi.mock('./firebase.utils', () => ({
  functions: null,
}));

const {
  draftToFormEvent,
  htmlToPlainText,
  normalizeAnnouncementDraft,
  plainTextToMessageHtml,
  programDescriptionFromMessage,
  PROGRAM_DESCRIPTION_MAX,
} = await import('./aiAnnouncement.utils');

describe('plainTextToMessageHtml', () => {
  it('wraps paragraphs and escapes html', () => {
    expect(plainTextToMessageHtml('Hello <b>ward</b>\n\nLine two')).toBe(
      '<p>Hello &lt;b&gt;ward&lt;/b&gt;</p><p>Line two</p>'
    );
  });

  it('turns bullet lines into indented lists', () => {
    expect(
      plainTextToMessageHtml('Choir practice.\n\n- Silent Night\n- Sleigh Bells\n\nCome ready to sing.')
    ).toBe(
      '<p>Choir practice.</p><ul><li>Silent Night</li><li>Sleigh Bells</li></ul><p>Come ready to sing.</p>'
    );
  });
});

describe('programDescriptionFromMessage', () => {
  it('returns plain text when the message already fits', () => {
    expect(programDescriptionFromMessage('<p>Choir practice this Sunday.</p>')).toBe(
      'Choir practice this Sunday.'
    );
  });

  it('returns null when the message is longer than the program limit', () => {
    const long = 'a'.repeat(PROGRAM_DESCRIPTION_MAX + 1);
    expect(programDescriptionFromMessage(`<p>${long}</p>`)).toBeNull();
  });

  it('strips list markup into plain text for the length check', () => {
    expect(htmlToPlainText('<p>Bring:</p><ul><li>Hymn book</li><li>Smile</li></ul>')).toBe(
      'Bring:\n• Hymn book\n• Smile'
    );
  });
});

describe('normalizeAnnouncementDraft', () => {
  it('defaults unknown type to event and clears invalid group', () => {
    expect(
      normalizeAnnouncementDraft({
        type: 'something',
        group: 'Not A Group',
        title: ' Youth activity ',
        endDate: '2026-11-15',
        message: 'Come join us',
      })
    ).toMatchObject({
      type: 'event',
      group: '',
      title: 'Youth activity',
      endDate: '2026-11-15',
    });
  });

  it('keeps announcement type and strips event-only fields', () => {
    expect(
      normalizeAnnouncementDraft({
        type: 'announcement',
        group: 'Ward',
        startDate: '2026-11-01',
        endDate: '2026-12-01',
        time: '7:00 pm',
        message: 'Sign up for cleaning',
      })
    ).toMatchObject({
      type: 'announcement',
      group: 'Ward',
      startDate: '',
      endDate: '2026-12-01',
      time: '',
    });
  });
});

describe('draftToFormEvent', () => {
  it('converts message text to html for the editor', () => {
    expect(
      draftToFormEvent({
        type: 'event',
        title: 'Picnic',
        group: 'Ward',
        endDate: '2026-11-20',
        message: 'Bring a side dish.',
      })
    ).toMatchObject({
      title: 'Picnic',
      message: '<p>Bring a side dish.</p>',
      endDate: '2026-11-20',
    });
  });
});
