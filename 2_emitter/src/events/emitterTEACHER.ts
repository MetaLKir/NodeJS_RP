import EventEmitter from "events";
import path from "node:path";
import fs from "node:fs";
import type {User} from "../model/usersTEACHER.js";

export const emitter = new EventEmitter();

const LOG_DIR = path.resolve(process.cwd(), "logs");

const ACTION_LOG = path.join(LOG_DIR, "actions.logs");
const ERROR_LOG = path.join(LOG_DIR, "errors.logs");
const REQUEST_LOG = path.join(LOG_DIR, "request.logs");

fs.mkdirSync(LOG_DIR, {recursive: true});

function nowIso() {
    return new Date().toISOString();
}

function safeJson(payload: unknown) {
    try {
        return JSON.stringify(payload);
    } catch (e) {
        return JSON.stringify("<unserilizable payload>");
    }
}

function normalizeError(error: unknown) {
    if (error instanceof Error) {
        return {name: error.name, message: error.message, stack: error.stack};
    }
    return {message: String(error)};
}

function append(file: string, line: string) {
    fs.appendFile(file, line.endsWith("\n") ? line : line + "\n",
        "utf8", (e) => {
            if (e) console.error("Failed to append file: " + e);
        });
}

function logLine(file: string, event: string, payload?: unknown) {
    append(file,
        `${nowIso()}__${event}__${payload === undefined ? "" : " " + safeJson(payload)}`,
    )
}

emitter.on("userCreated", (user: User) => {
    console.log("userCreated");
    logLine(ACTION_LOG, 'userCreated', user);
})
// Событие: пользователь обновлён
emitter.on("userUpdated", (user:User) => {
    console.log("[EVENT] userUpdated");
    logLine(ACTION_LOG, 'userUpdated', user);

});

// Событие: пользователь удалён
emitter.on("userDeleted", (user:User) => {
    console.log("[EVENT] userDeleted");
    logLine(ACTION_LOG, 'userDeleted', user);
});

emitter.on("requestIssue", (payload:unknown) => {
    //400 404 409
    logLine(REQUEST_LOG, 'requestIssue', payload);

})

// errors
emitter.on("error", (payload:unknown) => {
    //400 404 409
    logLine(ERROR_LOG, 'error', payload);

})

process.on("unhandledRejection", (reason: unknown) => {
    emitter.emit("error",{
        type: "unhandledRejection",
        reason: normalizeError(reason),
    })
})

process.on("uncaughtException", (reason: unknown) => {
    emitter.emit("error",{
        type: "uncaughtException",
        reason: normalizeError(reason),
    })
})