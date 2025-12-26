import {createServer, type IncomingMessage} from "node:http";
import {addUser, getAllUsers, type User} from "./model/users.js";
import {emitter} from "./events/emitter.js";


/*
GET/ -> Hello
GET/api/users               ->  list of users
POST/api/users              ->  add user to list of users
DELETE/api/users            ->  delete user by id from list of users
PUT/api/users               ->  update user by id

GET/api/users?userId=<num>  ->  user by id
 */

const PORT = 3005;

async function parseBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        })
        req.on("end", () => {
            if(!body) return resolve({});
            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch (e) {
                reject(new Error("Invalid JSON response"));
            }
        })
        req.on("error", (err) => {
            reject(err);
        })
    })
}

const myServer = createServer(
    async (req, res) => {
        const {url, method} = req;
        console.log("Request:", JSON.stringify(url), method);

        const parsedUrl = new URL(url??"/", "http://localhost:" + PORT);
        const pathname = parsedUrl.pathname;
        const userIdParam = parsedUrl.searchParams.get("userId");

        try {
            if (pathname === "/" && method === "GET") {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end("Hellow mawafawka");
                return;
            }
            if (pathname === "/api/users" && method === "GET") {
                if (!userIdParam) {
                    const users = getAllUsers();
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(users));
                    return;
                }
            }
            if (pathname === "/api/users" && method === "POST") {
                const body = (await parseBody(req)) as User;
                const isSuccess = await addUser(body);
                if (isSuccess) {
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.end("User was added successfully!");
                    emitter.emit("userCreated");
                } else {
                    res.writeHead(409, {"Content-Type": "text/html"});
                    res.end("User already exists!");
                }
                return;
            }
        } catch (e) {
            console.error("Server error", e);
            res.writeHead(500, {"Content-Type": "text/html"});
            res.end("Internal Server Error");
        }
    }
);

myServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});



