import EventEmitter from "events";

export const emitter = new EventEmitter();
emitter.on("userCreated", () => {
    console.log("User created");
})

emitter.on("userDeleted", () => {
    console.log("User deleted");
})

emitter.on("userUpdated", () => {
    console.log("User updated");
})