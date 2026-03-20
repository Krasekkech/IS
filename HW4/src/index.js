import fs from "node:fs";
import path from "node:path";
import { fsStore } from "./fsStore.js";
import { computeTF, computeDF, computeIDF, computeTFIDF, getSortedTerms } from "./tfIdf.js";
import { saveTFTable, saveIDFTable, saveTFIDFTable } from "./csv.js";

function main() {
    const inputDir = "../HW2/out_processed";
    const outputDir = "./tfidf_output";

    fs.mkdirSync(outputDir, { recursive: true });

    const documents = fsStore(inputDir);
    const terms = getSortedTerms(documents);

    const tf = computeTF(documents);
    const df = computeDF(documents);
    const idf = computeIDF(documents, df);
    const tfidf = computeTFIDF(tf, idf);

    saveTFTable(tf, terms, path.join(outputDir, "tf_table.csv"));
    saveIDFTable(idf, terms, path.join(outputDir, "idf_table.csv"));
    saveTFIDFTable(tfidf, terms, path.join(outputDir, "tfidf_table.csv"));
}

main();