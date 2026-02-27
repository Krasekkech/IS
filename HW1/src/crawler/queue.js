export class UrlQueue {
    constructor() {
        this.queue = [];
        this.visited = new Set();
        this.queued = new Set();
    }

    push(url) {
        if (!url) return;
        if (this.visited.has(url) || this.queued.has(url)) return;
        this.queue.push(url);
        this.queued.add(url);
    }

    shift() {
        while (this.queue.length) {
            const u = this.queue.shift();
            this.queued.delete(u);
            if (!this.visited.has(u)) {
                this.visited.add(u);
                return u;
            }
        }
        return null;
    }

    get length() {
        return this.queue.length;
    }
}