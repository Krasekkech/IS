export function computeTF(documents) {
    const tf = {};

    for (const [docId, words] of Object.entries(documents)) {
        const counts = {};
        const totalWords = words.length;

        for (const word of words) {
            counts[word] = (counts[word] || 0) + 1;
        }

        tf[docId] = {};
        for (const [term, count] of Object.entries(counts)) {
            tf[docId][term] = totalWords > 0 ? count / totalWords : 0;
        }
    }

    return tf;
}

export function computeDF(documents) {
    const df = {};

    for (const words of Object.values(documents)) {
        const uniqueWords = new Set(words);

        for (const term of uniqueWords) {
            df[term] = (df[term] || 0) + 1;
        }
    }

    return df;
}

export function computeIDF(documents, df) {
    const idf = {};
    const nDocs = Object.keys(documents).length;

    for (const [term, docFreq] of Object.entries(df)) {
        idf[term] = docFreq > 0 ? Math.log(nDocs / docFreq) : 0;
    }

    return idf;
}

export function computeTFIDF(tf, idf) {
    const tfidf = {};

    for (const [docId, terms] of Object.entries(tf)) {
        tfidf[docId] = {};

        for (const [term, tfValue] of Object.entries(terms)) {
            tfidf[docId][term] = tfValue * (idf[term] || 0);
        }
    }

    return tfidf;
}

export function getSortedTerms(documents) {
    const terms = new Set();

    for (const words of Object.values(documents)) {
        for (const word of words) {
            terms.add(word);
        }
    }

    return [...terms].sort((a, b) => a.localeCompare(b, "ru"));
}