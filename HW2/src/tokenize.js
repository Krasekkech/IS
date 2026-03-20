export function tokenize(text) {
    const s = (text || "")
        .toLowerCase()
        .normalize("NFD")                  // разложить символы
        .replace(/[\u0300-\u036f]/g, "")   // убрать ударения и диакритику
        .replace(/ё/g, "е")
        .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, "");

    return s.match(/[а-я]+/g) ?? [];
}