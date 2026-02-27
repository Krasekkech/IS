import { JSDOM } from "jsdom";

function normalize(u) {
    const url = new URL(u);
    url.hash = "";
    return url.toString();
}

export function extractLinks(html, base) {
    const dom = new JSDOM(html, { url: base });
    const doc = dom.window.document;
    const out = [];

    doc.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (!href) return;
        if (href.startsWith("#")) return;
        if (href.startsWith("mailto:")) return;
        if (href.startsWith("javascript:")) return;

        try {
            out.push(normalize(new URL(href, base).toString()));
        } catch {}
    });

    return out;
}