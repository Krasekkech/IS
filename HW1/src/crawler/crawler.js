import pLimit from "p-limit";
import { extractLinks, extractText, wordsCount, russianLang } from "../utils/index.js";
import { FsStore } from "../io/fsStore.js";

export async function runCrawler({ seedUrls, target, minWords, concurrency, outDir }) {
    const store = new FsStore(outDir);
    const limit = pLimit(concurrency);

    const queue = seedUrls.map((u) => new URL(u).toString());
    const seen = new Set(queue);

    let linkNumber = 0;
    const indexLines = [];

    while (linkNumber < target && queue.length) {
        const batch = queue.splice(0, concurrency);

        const results = await Promise.all(
            batch.map((url) =>
                limit(async () => {
                    const res = await fetch(url);
                    const html = await res.text();

                    for (const link of extractLinks(html, url)) {
                        if (!seen.has(link)) {
                            seen.add(link);
                            queue.push(link);
                        }
                    }

                    const text = extractText(html, url);
                    return { url, text };
                })
            )
        );

        for (const { url, text } of results) {
            if (linkNumber >= target) break;

            const wc = wordsCount(text);
            if (wc < minWords) continue;
            if (!russianLang(text)) continue;

            linkNumber++;
            store.write(`${linkNumber}.txt`, text);
            indexLines.push(`${linkNumber}\t${url}`);

            console.log(`${linkNumber}: ${url} (${wc} слов)`);
        }
    }

    store.write("index.txt", indexLines.join("\n") + "\n");
}