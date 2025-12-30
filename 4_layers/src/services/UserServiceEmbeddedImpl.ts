import type {UserService} from "./UserService.js";
import type {UserFilePersistenceService} from "./UserFilePersistenceService.js";
import path from "node:path";
import type {User} from "../model/users.js";
import fs from "node:fs";

export class UserServiceEmbeddedImpl implements UserService, UserFilePersistenceService {
    private users: User[] = [{id: 1, username: 'admin'}, {id: 2, username: 'user1'}];
    private filePath = path.resolve(process.cwd(), "users.txt");

    getAll(): User[] {
        return this.getAllUsers();
    }

    getById(id: number): User | null {
        return this.getUser(id);
    }

    deleteById(id: number): User | null {
        const deleted = this.removeUser(id);
        if (deleted) this.saveDataToFile();
        return deleted;
    }

    create(user: User): boolean {
        const ok = this.addUser(user);
        if (ok) this.saveDataToFile();
        return ok;
    }

    update(user: User): User | null {
        const ok = this.updateUser(user);
        if (!ok) return null;
        this.saveDataToFile();
        return user;
    }

    //==========================================================


    getAllUsers() {
        return [...this.users];
    }

    getUser(id: number) {
        return this.users.find((user) => user.id === id) ?? null;
    }

    removeUser(id: number) {
        const idx = this.users.findIndex((u) => u.id === id);
        if (idx === -1) return null;

        const deleted = this.users[idx];
        this.users.splice(idx, 1);
        return deleted ?? null;
    }

    addUser(user: User) {
        if (this.users.findIndex((item) => item.id === user.id) !== -1) {
            return false;
        }
        this.users.push(user);
        return true;
    }

    updateUser(user: User) {
        const idx = this.users.findIndex((u) => u.id === user.id);
        if (idx === -1) return false;

        this.users[idx] = user;
        return true;
    }

    saveDataToFile() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.users), "utf8");
            return "ok"
        } catch (e) {
            return "Write error"
        }
    }

    restoreDataFromFile(): string {
        try {
            if (!fs.existsSync(this.filePath)) {
                return "File not found, use default data"
            }
            const raw = fs.readFileSync(this.filePath, "utf8").trim();
            if (!raw) return "File empty, use default data";
            const data = JSON.parse(raw);
            if (!Array.isArray(data)) return "Invalid data, use default data";
            this.users = data as User[];
            return "ok";
        } catch (e) {
            return "Restore error, use default data"
        }
    }
}