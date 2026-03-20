import fs from "node:fs";
import path from "node:path";
import { evaluateQuery } from "./parser.js";

const indexPath = "./search_data/inverted_index.json";
const query = process.argv.slice(3).join(" ");

const data = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const result = evaluateQuery(query, data);

console.log("Запрос:", query);
console.log("Документы:", result.length ? result.join(", ") : "нет совпадений");
