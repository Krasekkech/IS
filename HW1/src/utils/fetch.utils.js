export async function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, {
            signal: controller.signal,
            redirect: "follow",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (compatible; SimpleCrawler/1.0; +https://example.com/bot)",
                "Accept-Language": "ru,en;q=0.8",
            },
        });
        return res;
    } finally {
        clearTimeout(t);
    }
}