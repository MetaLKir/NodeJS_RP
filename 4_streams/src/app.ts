// https://www.lipsum.com

import fs from "node:fs";
import {pipeline, Transform} from "node:stream";
import zlib from "node:zlib";

/*
FLAGS:
a - append
w - rewrite
wx - rewrite exclusive (writes only in no such a file; need to catch an error)
 */

/*
encoding "utf8",
highWaterMark: 100,
start:
end: include
flags: "r"
 */

// ======= READING STREAMS =======
// const readStream = fs.createReadStream('./src/readme.txt', {
//     encoding: 'utf8',
//     highWaterMark: 100,
// });
//
// readStream.on("data", (chunk) => {
//     console.log(chunk.toString());
//     console.log("<<<END OF CHUNK>>>");
// })
//
// readStream.on("end", (chunk) => {
//     console.log("<<<READING FINISHED>>>")
// })
//
// readStream.on("error", (err) => {
//     console.error("Read stream error", err.message);
// })

//======= WRITE STREAMS ========
const writeStream = fs.createWriteStream('./src/writeme.txt', {
    flags: "w", // "a" is for "append"
})


writeStream.on("error", (err) => {
    console.error("Writing error", err.message);
})
writeStream.on("end", () => {
    console.log("Writing ended");
})
writeStream.on("finish", (chunk) => {
    console.log("Writing finished");
})
writeStream.on("close", (code) => {
    console.log("Writing closed", code);
})

writeStream.write("Hellaw mawafawka\n");
writeStream.write("End <3\n");

writeStream.end(() => {
    console.log("End func");
})

writeStream.close( () => {
    console.log("Close func");
})

//=============STREAM PIPE===============
const rs = fs.createReadStream("./src/readme.txt");
const ws = fs.createWriteStream("./src/writeMePipe.txt");
// rs.pipe(ws); // combines read and write streams
// rs.on("error", (err) => {
//     console.error("Read error", err.message);
//     ws.destroy(err);
// })
// ws.on("error", (err) => {
//     console.error("Write error", err.message);
// })

// pipeline(rs, ws, (err) => {
//     if (err) {
//         console.error("Pipeline error occurred", err);
//     } else {
//         console.log("Pipeline success");
//     }
// })

//====== COMPRESSING ======
// const ws1 = fs.createWriteStream("./src/writeMePipe.zlib");
// rs.pipe(zlib.createGzip()).pipe(ws1); // combines read and write streams
// rs.on("error", (err) => {
//     console.error("Read error", err.message);
//     ws.destroy(err);
// })
// ws.on("error", (err) => {
//     console.error("Write error", err.message);
// })

//======= TRANSFORMING STREAM ==========
const toUpperCase = new Transform({
    transform(chunk, encoding, callback) {
        try {
            const transformed = chunk.toString().toUpperCase();
            callback(null, transformed); // instead of "return transformed;"
        } catch (e) {
            callback(e as Error);
        }
    }
})

pipeline(rs, toUpperCase, ws, (err) => {
    if (err) {
        console.error("Pipeline error occurred", err);
    } else {
        console.log("Pipeline success");
    }
})