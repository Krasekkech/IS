import { runCrawler } from "./crawler/crawler.js";

const seedUrls = process.argv.slice(2);
if (seedUrls.length === 0) {
    console.error("Ошибка ноды");
    process.exit(1);
}

await runCrawler({
    seedUrls,
    target: 100,
    minWords: 1000,
    concurrency: 5,
    outDir: "./out",
});