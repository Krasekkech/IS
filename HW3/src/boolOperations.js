export function toSet(arr) {
    return new Set(arr);
}

export function intersection(a, b) {
    const result = new Set();
    for (const x of a) {
        if (b.has(x)) result.add(x);
    }
    return result;
}

export function union(a, b) {
    return new Set([...a, ...b]);
}

export function difference(allDocs, excluded) {
    const result = new Set();
    for (const x of allDocs) {
        if (!excluded.has(x)) result.add(x);
    }
    return result;
}