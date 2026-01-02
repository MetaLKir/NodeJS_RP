import {imgEqualSimple} from "./imgCompareSimple.js";
import {imgEqualUpgraded} from "./imgCompareUpgraded.js";

const imgName1 = "image.jpg";
const imgName2 = "imageSame.jpg";
const imgName3 = "imageOther.jpg";

const pathImage = `./src/images/${imgName1}`;
const pathImageSame = `./src/images/${imgName2}`;
const pathImageOther = `./src/images/${imgName3}`;

const comparisonSameText = `\"${imgName1}\" equals \"${imgName2}\":`;
const comparisonDiffText = `\"${imgName1}\" equals \"${imgName3}\":`;

// simple way
console.log(comparisonSameText, imgEqualSimple(pathImage, pathImageSame)); // same images
console.log(comparisonDiffText, imgEqualSimple(pathImage, pathImageOther)); // different images

console.log('='.repeat(50));

// upgraded way
console.log(comparisonSameText, await imgEqualUpgraded(pathImage, pathImageSame)); // same images
console.log(comparisonDiffText, await imgEqualUpgraded(pathImage, pathImageOther)); // different images
