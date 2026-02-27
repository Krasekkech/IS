import fs from "node:fs";
import path from "node:path";

export class FsStore {
    constructor(outDir) {
        this.dir = path.resolve(outDir);
        fs.mkdirSync(this.dir, { recursive: true });
    }

    write(name, text) {
        fs.writeFileSync(path.join(this.dir, name), text, "utf8");
    }
}