/*
app-> start
server -> create server shutdown
routes ->
controllers status
services -> logic
repository -> date
utils
event logger


 */

import {UserServiceEmbeddedImpl} from "./services/UserServiceEmbeddedImpl.js";
import {emitter} from "./events/emitter.js";
import {UserController} from "./controllers/UserController.js";
import {createServer} from "node:http";
import {PORT, SOCKET} from "./config/userConfig.js";
import {userRoutes} from "./routes/userRoutes.js";

export function launchServer() {
    const userService = new UserServiceEmbeddedImpl();

    try {
        userService.restoreDataFromFile();
    } catch (e) {
        emitter.emit("error", {
            type: "restoreDataFromFileError",
            error: e instanceof Error ? {name: e.name, message: e.message, stack: e.stack} : {message: String(e)},
        });
    }
    const userController = new UserController(userService);
    const server = createServer(
        async (req, res) => {
            const {url, method} = req;
            const parsedUrl = new URL(url ?? "/", SOCKET);
            const pathname = parsedUrl.pathname;
            const userIdParam = parsedUrl.searchParams.get("userId");
            const meta = {url, method, pathname, userIdParam};

            try {
                await userRoutes(req, res, userController, meta, pathname, method, userIdParam);
            } catch (e) {
                emitter.emit("error", {
                    type: "requestHandlerException",
                    ...meta,
                    error: e instanceof Error ? {name: e.name, message: e.message, stack: e.stack} :
                        {message: String(e)},
                });
                if (!res.headersSent) {
                    res.writeHead(500, {"Content-Type": "text/plain"});
                }
                res.end("Internal Server Error");
            }
        }
    );

    const shutdown = (signal: "SIGINT" | "SIGTERM") => {

        try {
            userService.saveDataToFile?.();
        } catch (e) {
            emitter.emit("error", {
                type: "saveDataToFileError",

                error: e instanceof Error ? {name: e.name, message: e.message, stack: e.stack} :
                    {message: String(e)},
            });
        }
        emitter.emit("shutdown", {signal})
        server.close((err) => {
            if (err) {
                emitter.emit("error", {type: "serverCloseError", error: err});
                process.exit(1);
                return;
            }
            process.exit(0);
        })

    }
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    server.listen(PORT, () => {
        console.log(`Listening on ${SOCKET}`);
    })
}