import type {UserController} from "../controllers/UserController.js";
import type {IncomingMessage, ServerResponse} from "node:http";
import {send} from "../utils/send.js";

export async function userRoutes(
    req: IncomingMessage,
    res: ServerResponse,
    controller: UserController,
    meta: any,
    pathname: string,
    method: string | undefined,
    userIdParam: string | null
) {

    if (pathname === "/" && method === "GET") {
        controller.hello(req, res, meta)
        return;
    }
    if (pathname === "/api/users" && method === "GET") {
        controller.getUsers(req, res, meta, userIdParam);
        return;
    }
    if (pathname === "/api/users" && method === "POST"){
        await controller.createUser(req,res,meta);
        return;
    }
    if (pathname === "/api/users" && method === "DELETE") {
        await controller.deleteUser(req,res,meta)
    }
    if (pathname === "/api/users" && method === "PUT") {
        await controller.updateUser(req,res,meta);
        return;
    }
    send(res, 404, "Not found", meta);
}