import fs from "node:fs";
import path from "node:path";
import { tokenize } from "./tokenize.js";
import { Lemmatizer } from "./lemmatizer.js";
import { getStopwordsSet } from "./stopwords.js";
import { Store } from "./fsStore.js";

export async function folderInit(inDir, outDir) {
    const store = new Store(outDir);
    const stopSet = getStopwordsSet();

    const files = fs
        .readdirSync(inDir)
        .filter((f) => /^\d+\.txt$/.test(f))

    const lemmatizer = new Lemmatizer({ concurrency: 25 });
    await lemmatizer.start();

    for (const file of files) {
        const inputPath = path.join(inDir, file);
        const text = fs.readFileSync(inputPath, "utf8");

        const tokens = tokenize(text);

        const lemmas = await lemmatizer.lemmatizeTokens(tokens);

        const filtered = lemmas.filter((w) => w && !stopSet.has(w));

        store.write(file, filtered.join("\n"));
        console.log(`${file} (токены=${tokens.length}, на выходе=${filtered.length})`);
    }

    const indexIn = path.join(inDir, "index.txt");
    if (fs.existsSync(indexIn)) {
        store.write("index.txt", fs.readFileSync(indexIn, "utf8"));
    }

    await lemmatizer.stop();
}