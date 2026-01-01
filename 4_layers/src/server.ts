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

import {UserRepository} from "./repositories/UserRepository.js";
import {emitter} from "./events/emitter.js";
import {UserController} from "./controllers/UserController.js";
import {createServer} from "node:http";
import {PORT, SOCKET} from "./config/userConfig.js";
import {userRoutes} from "./routes/userRoutes.js";
import {registerLogger} from "./events/logger.js";
import {registerProcessErrorHandler} from "./events/processError.js";
import {UserService} from "./services/UserService.js";

export function launchServer() {
    registerLogger();
    registerProcessErrorHandler();

    const repo = new UserRepository();
    const restoreNew = repo.restore();
    emitter.emit("appRestore", {restoreNew});
    if(restoreNew.toLowerCase().includes("error")  ||
    restoreNew.toLowerCase().includes("invalid")) {
        emitter.emit("error", {type: "repoRestoreError", restoreNew});
    }
    const service = new UserService(repo);

    const userController = new UserController(service);
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
            repo.save();
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