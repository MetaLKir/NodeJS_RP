import {createServer, type IncomingMessage, type ServerResponse} from "node:http";
import {addUser, deleteUser, getAllUsers, getUser, updateUser, type User} from "./model/users.js";
import {emitter} from "./events/emitterTEACHER.js";


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

function send(
    res: ServerResponse,
    status: number,
    payload: string | object,
    meta: Record<string, unknown>,
) {
    const isJson = typeof payload === "object";
    res.writeHead(status, {"Content-Type": isJson ? "application/json" : "text/html"});
    res.end(isJson ? JSON.stringify(payload) : payload);
    if (status >= 400 && status < 500) {
        emitter.emit("requestIssue", {
            ...meta,
            status,
            response: payload,
        });
    }
}

const myServer = createServer(
    async (req, res) => {
        const {url, method} = req;
        console.log("Request:", JSON.stringify(url), method);

        const parsedUrl = new URL(url ?? "/", "http://localhost:" + PORT);
        const pathname = parsedUrl.pathname;
        const userIdParam = parsedUrl.searchParams.get("userId");
        const meta = {url, method, pathname, userIdParam};

        try {
            // HELLO
            if (pathname === "/" && method === "GET") {
                send(res, 200, "Hellaw mawafawka", meta);
                return;
            }
            // GET ALL USERS OR BY ID
            if (pathname === "/api/users" && method === "GET") {
                if (!userIdParam) {
                    // const users = getAllUsers();
                    // res.writeHead(200, {"Content-Type": "application/json"});
                    // res.end(JSON.stringify(users));
                    send(res, 200, getAllUsers(), meta);
                    return;
                }
                const id = Number(userIdParam);
                if(Number.isNaN(id)){
                    send(res, 400, "user ID must be a number", meta);
                    return;
                }
                const user = getUser(id);
                if (!user) {
                    send(res, 404, "User not found", meta);
                    return;
                }
                send(res, 200, user, meta);
                return;

            }
            // ADD USER
            if (pathname === "/api/users" && method === "POST") {
                const body = (await parseBody(req)) as User;
                const isSuccess = addUser(body);
                if (!isSuccess) {
                    send(res, 409, "User already exist", {...meta, body});
                    return;
                }
                emitter.emit("userCreated", body);
                send(res, 201, "User created", meta);
                return;
            }
            // DELETE USER BY ID
            if (pathname === "/api/users" && method === "DELETE") {
                let deletedUser;
                if (userIdParam) {
                    deletedUser = deleteUser(Number(userIdParam));
                } else {
                    const body = await parseBody(req) as {id?: number};
                    if (typeof body.id !== "number") {
                        send(res, 400, "Field 'id' is required and must be a number", {...meta, body});
                        return;
                    }
                    deletedUser = deleteUser(body.id);
                }
                if (!deletedUser) {
                    emitter.emit("requestIssue", "User doesn't exist!");
                    send(res, 409, "User doesn't exist!", meta);
                    return;
                }
                emitter.emit("userDeleted", deletedUser);
                send(res, 200, "User deleted:\n" + JSON.stringify(deletedUser), meta);
                return;
            }
            // UPDATE USER BY ID
            if (pathname === "/api/users" && method === "PUT") {
                const body = (await parseBody(req)) as { id: number, user: User };
                const updatedUser = updateUser(body.id, body.user);
                if(!updatedUser) {
                    send(res, 404, "User not found", {...meta, body});
                    return;
                }
                emitter.emit("userUpdated", updatedUser);
                send(res, 200, "User updated", meta);
                return;
            }
            send(res, 404, "Not found", meta);
        } catch (e) {
            console.error("Server error", e);
            emitter.emit("error", {
                type: "requestHandlerException",
                ...meta,
                error: e instanceof Error ?
                    {name: e.name, message: e.message, stack: e.stack}
                    : {message: String(e)},
            });
            res.writeHead(500, {"Content-Type": "text/html"});
            res.end("Internal Server Error");
        }
    }
);

myServer.on("error", (err: any) => {
    if(err?.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
        process.exit(1);
    }
    // other problems and errors
    console.error("Server start error:", err);
    process.exit(1);
})

myServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});



