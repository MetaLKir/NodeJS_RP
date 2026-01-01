import fs from "node:fs";

const imgName1 = "image.jpg";
const imgName2 = "imageSame.jpg";
const imgName3 = "imageOther.jpg";

const pathImage = `./src/${imgName1}`;
const pathImageSame = `./src/${imgName2}`;
const pathImageOther = `./src/${imgName3}`;

const img = fs.readFileSync(pathImage);
const imgSame = fs.readFileSync(pathImageSame);
const imgOther = fs.readFileSync(pathImageOther);

// same images
console.log(`\"${imgName1}\" and \"${imgName2}\" equals:`, img.equals(imgSame));
// different images
console.log(`\"${imgName1}\" and \"${imgName3}\" equals:`, img.equals(imgOther));
