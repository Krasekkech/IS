import fs from "node:fs";

export function saveTFTable(tf, terms, outputPath) {
    const docIds = Object.keys(tf).map(Number).sort((a, b) => a - b);

    const lines = [];
    lines.push(["term", ...docIds.map((id) => `doc_${id}`)].join(","));

    for (const term of terms) {
        const row = [term];

        for (const docId of docIds) {
            const value = tf[docId]?.[term] || 0;
            row.push(value.toFixed(6));
        }

        lines.push(row.join(","));
    }

    fs.writeFileSync(outputPath, "\uFEFF" + lines.join("\n"), "utf8");
}

export function saveIDFTable(idf, terms, outputPath) {
    const lines = [];
    lines.push("term,idf");

    for (const term of terms) {
        lines.push(`${term},${(idf[term] || 0).toFixed(6)}`);
    }

    fs.writeFileSync(outputPath, "\uFEFF" + lines.join("\n"), "utf8");
}

export function saveTFIDFTable(tfidf, terms, outputPath) {
    const docIds = Object.keys(tfidf).map(Number).sort((a, b) => a - b);

    const lines = [];
    lines.push(["term", ...docIds.map((id) => `doc_${id}`)].join(","));

    for (const term of terms) {
        const row = [term];

        for (const docId of docIds) {
            const value = tfidf[docId]?.[term] || 0;
            row.push(value.toFixed(6));
        }

        lines.push(row.join(","));
    }

    fs.writeFileSync(outputPath, "\uFEFF" + lines.join("\n"), "utf8");
}