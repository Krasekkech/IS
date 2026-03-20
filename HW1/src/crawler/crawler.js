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

    const antiIndexLines = [];
    const antiIndexSet = new Set();
    const savedUrls = new Set();

    while (linkNumber < target && queue.length) {
        const batch = queue.splice(0, concurrency);

        const results = await Promise.all(
            batch.map((url) =>
                limit(async () => {
                    const res = await fetch(url);
                    const html = await res.text();

                    const { links, rejected } = extractLinks(html, url);

                    for (const badLink of rejected) {
                        const prettyBadLink = decodeURI(badLink).replace(/ /g, "_");
                        if (!antiIndexSet.has(prettyBadLink)) {
                            antiIndexSet.add(prettyBadLink);
                            antiIndexLines.push(prettyBadLink);
                        }
                    }

                    for (const link of links) {
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
            const prettyUrl = decodeURI(url);

            if (wc < minWords || !russianLang(text)) {
                if (!antiIndexSet.has(prettyUrl)) {
                    antiIndexSet.add(prettyUrl);
                    antiIndexLines.push(prettyUrl);
                }
                continue;
            }

            if (savedUrls.has(prettyUrl)) continue;
            savedUrls.add(prettyUrl);

            linkNumber++;
            store.write(`${linkNumber}.txt`, text);
            indexLines.push(`${linkNumber}\t${prettyUrl}`);

            console.log(`${linkNumber}: ${prettyUrl} (${wc} слов)`);
        }
    }

    store.write("index.txt", indexLines.join("\n") + "\n");
    store.write("antiindex.txt", antiIndexLines.join("\n") + "\n");
}