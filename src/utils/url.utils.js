export const normalizeUrl = (url = '') => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const hasValidHostname = (hostname) => {
  if (!hostname || !/^[a-z0-9.-]+$/i.test(hostname)) return false;
  if (hostname === 'localhost') return true;

  const parts = hostname.split('.');
  return parts.length >= 2 && parts.every((part) => part.length > 0) && parts.at(-1).length >= 2;
};

export const isValidUrl = (url = '') => {
  const trimmed = url.trim();
  if (!trimmed) return true;

  try {
    const parsed = new URL(normalizeUrl(trimmed));
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    return hasValidHostname(parsed.hostname);
  } catch {
    return false;
  }
};
