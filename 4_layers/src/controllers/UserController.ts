import type {UserService} from "../services/UserService.js";
import type {IncomingMessage, ServerResponse} from "node:http";
import {send} from "../utils/send.js";
import { type User} from "../model/users.js";
import {parseBody} from "../utils/parseBody.js";
import {emitter} from "../events/emitter.js";


export class UserController {
    constructor(private userService: UserService) {
    }

    hello(req: IncomingMessage, res: ServerResponse, meta: any) {
        send(res, 200, "Hello Carmiel", meta);
    }

    getUsers(req: IncomingMessage, res: ServerResponse, meta: any, userIdParam: string | null) {
        if (!userIdParam) {
            send(res, 200, this.userService.getAll(), meta)
            return
        }
        const id = Number(userIdParam);
        if (Number.isNaN(id)) {

            send(res, 400, "userId must be a number", meta);
            return;
        }
        const user = this.userService.getById(id);
        if (!user) {
            send(res, 404, "user not found", meta);
            return;
        }

        send(res, 200, user, meta)
        return;

    }

    async createUser(req: IncomingMessage, res: ServerResponse, meta: any) {
        const body = (await parseBody(req)) as User;
        const isSuccess = this.userService.create(body);
        if (!isSuccess) {
            send(res, 409, "user already exists", {...meta, body});
            return;
        }

        emitter.emit("userCreated", body);
        send(res, 201, "user created", meta);
        return;
    }

    async deleteUser(req: IncomingMessage, res: ServerResponse, meta: any) {
        const body = (await parseBody(req)) as { id?: number };

        if (typeof body.id !== "number") {

            send(res, 400, "Field 'id' is required and must be a number", {...meta, body});
            return;
        }

        const deleted = this.userService.deleteById(body.id);

        if (deleted) {
            emitter.emit("userDeleted", deleted);
            send(res, 200, deleted, meta);
            return;
        }

        send(res, 404, "User not found", {...meta, body});

        return;
    }
    async updateUser(req: IncomingMessage, res: ServerResponse, meta: any) {
        const body = (await parseBody(req)) as User;
        const updated = this.userService.update(body);
        if (!updated) {
            send(res, 404, "User not found", {...meta, body});
            return;
        }


        emitter.emit("userUpdated", body);
        send(res, 200, updated, meta);

        return;
    }
}