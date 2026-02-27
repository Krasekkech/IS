export function clean(text) {
    return (text || "")
        .replace(/\u00A0/g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export function wordsCount(text) {
    return clean(text).split(/\s+/).filter(Boolean).length;
}

export function russianLang(text) {
    const s = clean(text);
    const cyr = (s.match(/[А-Яа-яЁё]/g) || []).length;
    const lat = (s.match(/[A-Za-z]/g) || []).length;
    return cyr + lat > 0 && cyr / (cyr + lat) >= 0.8;
}