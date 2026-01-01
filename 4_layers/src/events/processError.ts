import {emitter} from "./emitter.js";

function normalizeError(error: unknown) {
    if (error instanceof Error) {
        return {name: error.name, message: error.message, stack: error.stack};
    }
    return {message: String(error)};
}

export function registerProcessErrorHandler() {
    process.on("unhandledRejection", (reason: unknown) => {
        emitter.emit("error", {
            type: "unhandledRejection",
            reason: normalizeError(reason),
        })
    })

    process.on("uncaughtException", (reason: unknown) => {
        emitter.emit("error", {
            type: "uncaughtException",
            reason: normalizeError(reason),
        })
    })
}