import fs from "node:fs";

export const imgEqualSimple =
    (imgPath1: string, imgPath2: string) => {
    const img1 = fs.readFileSync(imgPath1);
    const img2 = fs.readFileSync(imgPath2);
    return img1.equals(img2);
}
