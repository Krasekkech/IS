import fs from "node:fs";
import path from "node:path";

function normalizeWord(word) {
    return (word || "")
        .toLowerCase()
        .replace(/ё/g, "е")
        .trim();
}

function buildInvertedIndex(docsDir) {
    const files = fs
        .readdirSync(docsDir)
        .filter((f) => /^\d+\.txt$/.test(f))
        .sort((a, b) => parseInt(a) - parseInt(b));

    const index = new Map();
    const allDocs = [];

    for (const file of files) {
        const docId = parseInt(file);
        allDocs.push(docId);

        const text = fs.readFileSync(path.join(docsDir, file), "utf8");

        const words = text
            .split(/\r?\n/)
            .map(normalizeWord)
            .filter(Boolean);

        const uniqueWords = new Set(words);

        for (const word of uniqueWords) {
            if (!index.has(word)) {
                index.set(word, new Set());
            }
            index.get(word).add(docId);
        }
    }

    return { index, allDocs };
}

function saveIndex(index, allDocs, outDir) {
    fs.mkdirSync(outDir, { recursive: true });

    const sortedTerms = [...index.keys()].sort((a, b) => a.localeCompare(b, "ru"));

    const txtLines = sortedTerms.map((term) => {
        const docs = [...index.get(term)].sort((a, b) => a - b);
        return `${term}: ${docs.join(", ")}`;
    });

    fs.writeFileSync(
        path.join(outDir, "inverted_index.txt"),
        txtLines.join("\n") + "\n",
        "utf8"
    );

    const jsonObject = {
        allDocs: allDocs.sort((a, b) => a - b),
        index: Object.fromEntries(
            sortedTerms.map((term) => [term, [...index.get(term)].sort((a, b) => a - b)])
        ),
    };

    fs.writeFileSync(
        path.join(outDir, "inverted_index.json"),
        JSON.stringify(jsonObject, null, 2),
        "utf8"
    );
}

const docsDir = "../HW2/out_processed";
const outDir = "./search_data";

const { index, allDocs } = buildInvertedIndex(docsDir);
saveIndex(index, allDocs, outDir);

console.log("Индекс построен");