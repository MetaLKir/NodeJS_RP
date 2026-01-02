import {createHash} from "node:crypto";
import {createReadStream} from "node:fs";
import {pipeline} from "node:stream/promises";
import {stat} from "node:fs/promises";

const hashImg = async (path: string): Promise<string> => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    await pipeline(stream, hash);
    return hash.digest("hex");
};

export const imgEqualUpgraded = async (filePath1: string, filePath2: string) => {
    const [stat1, stat2] = await Promise.all([
        stat(filePath1),
        stat(filePath2),
    ]);
    if (stat1.size !== stat2.size) return false;

    const [hash1, hash2] = await Promise.all([
        hashImg(filePath1),
        hashImg(filePath2),
    ]);
    return hash1 === hash2;
}
