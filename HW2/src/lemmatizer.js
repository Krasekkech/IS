import pLimit from "p-limit";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const MyStem = require("mystem3");

export class Lemmatizer {
    constructor({ concurrency = 25 } = {}) {
        this.concurrency = concurrency;
        this.limit = pLimit(concurrency);
        this.cache = new Map();

        this.myStem = new MyStem();
    }

    async start() {
        this.myStem.start();
    }

    async stop() {
        this.myStem.stop();
    }

    async lemmatizeTokens(tokens) {
        const out = await Promise.all(tokens.map((t) => this.limit(() => this.lemmatizeOne(t))));
        return out;
    }

    async lemmatizeOne(token) {
        if (this.cache.has(token)) return this.cache.get(token);

        const raw = await this.myStem.lemmatize(token);
        let lemma = Array.isArray(raw) ? raw[0] : raw;

        lemma = (lemma || token)
            .toString()
            .trim()
            .toLowerCase()
            .replace(/ё/g, "е")
            .split(/\s+/)[0];

        this.cache.set(token, lemma);
        return lemma;
    }
}