import EventEmitter from "events";

export const emitter = new EventEmitter();
emitter.on("userCreated", () => {
    console.log("User created");
})