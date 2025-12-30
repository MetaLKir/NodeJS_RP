import type {ServerResponse} from "node:http";
import {emitter} from "../events/emitter.js";

export function send(
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