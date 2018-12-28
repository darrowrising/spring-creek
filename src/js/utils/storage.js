export function setStorage(key, content) {
    let val = content;
    if (typeof content === 'object') {
        val = JSON.stringify(content);
    }

    localStorage.setItem(key, val);
}

export function getStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
