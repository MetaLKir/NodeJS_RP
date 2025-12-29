import {createServer, type IncomingMessage, type ServerResponse} from "node:http";
import {addUser, getAllUsers, getUserById, removeUser, updateUser, type User} from "./model/usersTEACHER.js";
import {emitter} from "./events/emitterTEACHER.js";


const PORT = 3005;

async function parseBody(req: IncomingMessage) {
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

const myServer = createServer(async (req, res) => {
    const {url, method} = req;
    console.log("Request:", JSON.stringify(url), method);

    const parsedUrl = new URL(url ?? "/", "http://localhost:" + PORT);
    const pathname = parsedUrl.pathname;
    const userIdParam = parsedUrl.searchParams.get("userId");
    const meta = {url, method, pathname, userIdParam};

    try {
        if (pathname === "/" && method === "GET") {

            send(res, 200, "Hello Carmiel", meta)
            return;
        }
        if (pathname === "/api/users" && method === "GET") {
            if (!userIdParam) {

                send(res, 200, getAllUsers(), meta)
                return;
            }
            const id = Number(userIdParam);
            if (Number.isNaN(id)) {

                send(res, 400, "userId must be a number", meta);
                return;
            }
            const user = getUserById(id);
            if (!user) {
                send(res, 404, "user not found", meta);
                return;
            }

            send(res, 200, user, meta)
            return;

        }
        if (pathname === "/api/users" && method === "POST") {
            const body = (await parseBody(req)) as User;
            const isSuccess = addUser(body);
            if (!isSuccess) {
                send(res, 409, "user already exists", {...meta, body});
                return;
            }

            emitter.emit("userCreated", body);
            send(res, 201, "user created", meta);
            return;
        }
        if (pathname === "/api/users" && method === "DELETE") {
            const body = (await parseBody(req)) as { id?: number };

            if (typeof body.id !== "number") {

                send(res, 400, "Field 'id' is required and must be a number", {...meta, body});
                return;
            }

            const deleted = removeUser(body.id);

            if (deleted) {
                emitter.emit("userDeleted", deleted);
                send(res, 200, deleted, meta);
                return;
            }

            send(res, 404, "User not found", {...meta, body});

            return;
        }
        if (pathname === "/api/users" && method === "PUT") {
            const body = (await parseBody(req)) as User;
            const updated = updateUser(body);
            if (!updated) {
                send(res, 404, "User not found", {...meta, body});
                return;
            }
            emitter.emit("userUpdated", body);
            send(res, 200, updated, meta);
            return;
        }
        send(res, 404, "Not found", meta);
    } catch (e) {
        console.error("Server error", e);
        emitter.emit("error", {
            type: "requestHandlerException",
            ...meta,
            error: e instanceof Error ? {name: e.name, message: e.message, stack: e.stack} :
                {message: String(e)},
        });
        res.writeHead(500, {"Content-Type": "text/html"});
        res.end("Internal Server Error");
    }

});
myServer.on("error", (err: any) => {
    if (err?.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
        process.exit(1);
    }

    // всякие другие проблемы и ошибки
    console.error("Server start error:", err);
    process.exit(1);
});

myServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})