import {createServer, type IncomingMessage} from "node:http";
import {addUser, deleteUser, getAllUsers, getUser, updateUser, type User} from "./model/users.js";
import {emitter} from "./events/emitter.js";


/*
done | GET/ -> Hello
done | GET/api/users               ->  list of users
done | POST/api/users              ->  add user to list of users
done | DELETE/api/users            ->  delete user by id from list of users
done | PUT/api/users               ->  update user by id
done | GET/api/users?userId=<num>  ->  user by id
 */

const PORT = 3005;

async function parseBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        })
        req.on("end", () => {
            if (!body) return resolve({});
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

        const parsedUrl = new URL(url ?? "/", "http://localhost:" + PORT);
        const pathname = parsedUrl.pathname;
        const userIdParam = parsedUrl.searchParams.get("userId");

        try {
            // HELLO
            if (pathname === "/" && method === "GET") {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end("Hellow mawafawka");
                return;
            }
            // GET ALL USERS OR BY ID
            if (pathname === "/api/users" && method === "GET") {
                if (!userIdParam) {
                    const users = getAllUsers();
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(users));
                } else {
                    const id = Number(userIdParam);
                    const user = getUser(id);
                    if (user) {
                        res.writeHead(200, {"Content-Type": "application/json"});
                        res.end(JSON.stringify(user));
                    } else {
                        res.writeHead(404, {"Content-Type": "text/html"});
                        res.end("User not found!");
                    }
                }
                return;
            }
            // ADD USER
            if (pathname === "/api/users" && method === "POST") {
                const body = (await parseBody(req)) as User;
                const isSuccess = addUser(body);
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
            // DELETE USER BY ID
            if (pathname === "/api/users" && method === "DELETE") {
                let deletedUser;
                if (userIdParam) {
                    deletedUser = deleteUser(Number(userIdParam));
                } else {
                    const {id} = await parseBody(req) as {id: number};
                    deletedUser = deleteUser(id);
                }
                if (deletedUser) {
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.end("User was deleted successfully!");
                    emitter.emit("userDeleted");
                } else {
                    res.writeHead(409, {"Content-Type": "text/html"});
                    res.end("User doesn't exist!");
                }
            }
            // UPDATE USER BY ID
            if (pathname === "/api/users" && method === "PUT") {
                const body = (await parseBody(req)) as { id: number, user: User };
                const updatedUser = updateUser(body.id, body.user);
                if (updatedUser) {
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.end("User updated successfully!");
                    emitter.emit("userUpdated");
                } else {
                    res.writeHead(409, {"Content-Type": "text/html"});
                    res.end("User doesn't exist!");
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



