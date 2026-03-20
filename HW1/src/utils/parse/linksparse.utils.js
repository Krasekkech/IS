import { JSDOM } from "jsdom";


function normalize(u) {
    const url = new URL(u);
    url.hash = "";
    return url.toString();
}

export function extractLinks(html, base) {
    const dom = new JSDOM(html, { url: base });
    const doc = dom.window.document;

    const links = [];
    const rejected = [];

    doc.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (!href) return;

        if (href.startsWith("#")) {
            rejected.push(href);
            return;
        }

        if (href.startsWith("mailto:")) {
            rejected.push(href);
            return;
        }

        if (href.startsWith("javascript:")) {
            rejected.push(href);
            return;
        }

        try {
            const fullUrl = new URL(href, base);

            if (fullUrl.pathname === "/w/index.php") {
                rejected.push(decodeURI(fullUrl.toString()));
                return;
            }

            links.push(normalize(fullUrl.toString()));
        } catch {}
    });

    return { links, rejected };
}
