import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { clean, wordsCount } from "./textparse.utils.js";

export function extractText(html, url) {
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    const art = new Readability(doc).parse();
    let text = clean(art?.textContent || "");

    if (wordsCount(text) < 300) {
        const root =
            doc.querySelector("#mw-content-text") ||
            doc.querySelector(".mw-parser-output") ||
            doc.body;

        const parts = [];
        root?.querySelectorAll("p, li").forEach((el) => {
            const t = clean(el.textContent);
            if (t.length >= 50) parts.push(t);
        });

        text = clean(parts.join("\n"));
    }

    return text;
}