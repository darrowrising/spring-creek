export function getStorage(key, noAlert) {
  const val = localStorage.getItem(key) || sessionStorage.getItem(key) || '';

  if (!val && noAlert) {
    console.error(`Error getting item ${key} from local and session storage. ${key} does not exist in storage.`);
    return null;
  }

  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

export function setStorage(key, value, session) {
  let val = value;
  let storage = localStorage;

  if (typeof val !== 'string') val = JSON.stringify(value);
  if (session === 'session') storage = sessionStorage;

  storage.setItem(key, val);
}

export function removeStorage(key) {
  let storage = '';

  if (localStorage.getItem(key)) storage = localStorage;
  if (sessionStorage.getItem(key)) storage = sessionStorage;
  if (storage) storage.removeItem(key);
}
