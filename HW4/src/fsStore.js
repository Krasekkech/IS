import fs from "node:fs";
import path from "node:path";

export function fsStore(inputDir) {
    const files = fs
        .readdirSync(inputDir)
        .filter((f) => /^\d+\.txt$/.test(f))
        .sort((a, b) => parseInt(a) - parseInt(b));

    const documents = {};

    for (const filename of files) {
        const docId = parseInt(filename);
        const filePath = path.join(inputDir, filename);

        const words = fs
            .readFileSync(filePath, "utf8")
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);

        documents[docId] = words;
    }

    return documents;
}