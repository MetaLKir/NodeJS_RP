import type {IncomingMessage} from "node:http";

export async function parseBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            // console.log(chunk);
            body += chunk.toString();
        })
        req.on("end", () => {
            if (!body) {
                return resolve({});
            }
            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch (e) {
                reject(new Error("Invalid JSON request body"));
            }
        })
        req.on("error", (err) => {
            reject(err);
        })
    })
}