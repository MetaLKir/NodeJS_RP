import express, {type NextFunction, type Response, type Request} from "express";

const server = express(); // server creation
const PORT = 3005;

server.get("/", (req, res) => {
    res.send("Hellaw Express mawafawka!");
})

server.use(express.json()); // tells to read request body as json; "parseBody" func in lesson 4

type User = { id: number, username: string };
const users: User[] = [
    {id: 1, username: "admin"},
    {id: 2, username: "user1"},
]

// GET /api/users
server.get("/api/users", (req, res) => {
    res.json(users);
})
// POST /api/users
server.post("/api/users", validateCreateUser, (req, res) => {
    const user = req.body as User;
    users.push({...user});
    res.status(201).json({message: "User created"});
})

function validateCreateUser(req: Request, res: Response, next: NextFunction) {
    const {id, username} = req.body ?? {};
    if (typeof id !== "number")
        return res.status(400).json({error: "ID must me a number"});
    if (typeof username !== "string")
        return res.status(400).json({error: "Username must be a non-empty string"});
    next();
}

server.delete("/api/users/:id", validateIdParam, (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index === -1)
        return res.status(404).json({error: "User not found"});
    const deletedUser = users.splice(index, 1)[0];
    res.status(200).json({message: "User deleted", deletedUser});

})

function validateIdParam(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
        return res.status(400).json({error: "ID must be a number"});
    next();
}

server.put("/api/users/:id", validateIdParam, validateUpdateUser, (req, res) => {
    const id = Number(req.params.id);
    const userNew = req.body as Partial<Omit<User, "id">>;
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
        return res.status(404).json({error: "User not found"});
    }
    const userOld = users[index] as User;
    users[index] = {...userOld, ...userNew};
    res.status(200).json({message: "User updated", updatedUser: users[index]});
})

function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
    const {username} = req.body ?? {};
    if (typeof username !== "string" || !username.trim())
        return res.status(400).json({error: "Username must be a non-empty string"});
    next();
}

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    console.error("Unhandled error", err);
}

// server run
server.use(errorHandler);
server.listen(PORT, () => {
    console.log("Listening on http://localhost:" + PORT);
});