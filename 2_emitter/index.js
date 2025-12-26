import os from "os";
import fs from "fs";
import path from "path";
import EventEmitter from "events";
import crypto from "crypto";

console.log("Free mem: ", os.freemem());
console.log("Total mem: ", os.totalmem());
console.log("Platform: ", os.platform());

fs.writeFileSync("read.txt", "Hello motherfuckers", "utf8");
const text = fs.readFileSync("read.txt", "utf8");
console.log(text);

console.log("End sync");

fs.writeFile("readme1.txt", "Welcome to Hell .!.", "utf8", (err) => {
    if (err) return console.log(err.message);
    fs.readFile("readme1.txt", "utf8", (err1, data) => {
        if (err1) return console.log(err1.message);
        console.log("Read:", data);
    })
});
console.log("End async");

// sync functions: .join() .resolve()

//===== path =====
console.log(path.extname("readme.txt"));
// parsedUrl.origin pathname search searchParam

//===== event emitter =====
const newEmitter = new EventEmitter();
newEmitter.on("quote", (message) => {
    console.log("Event quote:", message);
})

newEmitter.emit("quote", "Die motherfucker, DIE \\m/");

//===== crypto =====
const password = "my_password";
const hash = crypto.createHash("sha256").update(password).digest("hex");
console.log("Sha256", hash);

