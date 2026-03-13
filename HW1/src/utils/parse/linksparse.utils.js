import { JSDOM } from "jsdom";

function normalizeWikiLink(urlObj) {
    urlObj.hash = "";

    if (urlObj.pathname === "/w/index.php") {
        const title = urlObj.searchParams.get("title");
        if (!title) return null;

        const wikiTitle = title.replace(/ /g, "_");
        urlObj.pathname = `/wiki/${wikiTitle}`;
    }

    urlObj.search = "";

    if (!urlObj.pathname.startsWith("/wiki/")) return null;

    const titleDecoded = decodeURIComponent(urlObj.pathname.slice("/wiki/".length));
    if (titleDecoded.startsWith("Special:") || titleDecoded.startsWith("Служебная:")) {
        return null;
    }

    return urlObj.toString();
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
            const abs = new URL(href, base);
            const norm = normalizeWikiLink(abs);
            if (norm) out.push(norm);
        } catch {}
    });

    return out;
}