export function tokenize(text) {
    const s = (text || "")
        .toLowerCase()
        .replace(/ё/g, "е");

    return s.match(/[а-я]+/g) ?? [];
}