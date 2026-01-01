import fs from "node:fs";
import type {User} from "../model/users.js";

export class FileStore {
    constructor(private filePath: string) {
    }

    writeText(text: string): void {
        fs.writeFileSync(this.filePath, text, "utf8");
    }

    readText(): string | null {
        if (!fs.existsSync(this.filePath)) {
            return null;
        }
        const raw = fs.readFileSync(this.filePath, "utf8");
        return raw.trim() ? raw : null;
    }
}