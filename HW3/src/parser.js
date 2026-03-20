import { intersection, union, difference, toSet } from "./boolOperations.js";

function tokenize(query) {
    const normalized = query
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(/([!&|()])/g, " $1 ")
        .replace(/\s+/g, " ")
        .trim();

    const rawTokens = normalized.split(" ");

    return rawTokens.map((token) => {
        if (token === "и") return "&";
        if (token === "или") return "|";
        if (token === "не") return "!";
        return token;
    });
}

function precedence(op) {
    if (op === "!") return 3;
    if (op === "&") return 2;
    if (op === "|") return 1;
    return 0;
}

function toPostfix(tokens) {
    const output = [];
    const ops = [];

    for (const token of tokens) {
        if (/^[а-я]+$/.test(token)) {
            output.push(token);
        } else if (token === "!" || token === "&" || token === "|") {
            while (
                ops.length &&
                precedence(ops[ops.length - 1]) >= precedence(token)
                ) {
                output.push(ops.pop());
            }
            ops.push(token);
        }
    }

    while (ops.length) {
        output.push(ops.pop());
    }

    return output;
}

export function evaluateQuery(query, data) {
    const tokens = tokenize(query);
    const postfix = toPostfix(tokens);

    const stack = [];
    const allDocsSet = toSet(data.allDocs);

    for (const token of postfix) {
        if (/^[а-я]+$/.test(token)) {
            const docs = data.index[token] ?? [];
            stack.push(toSet(docs));
        } else if (token === "!") {
            const a = stack.pop() ?? new Set();
            stack.push(difference(allDocsSet, a));
        } else if (token === "&") {
            const b = stack.pop() ?? new Set();
            const a = stack.pop() ?? new Set();
            stack.push(intersection(a, b));
        } else if (token === "|") {
            const b = stack.pop() ?? new Set();
            const a = stack.pop() ?? new Set();
            stack.push(union(a, b));
        }
    }

    const result = stack.pop() ?? new Set();
    return [...result].sort((a, b) => a - b);
}