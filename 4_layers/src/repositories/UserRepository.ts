import path from "node:path";
import type {User} from "../model/users.js";
import {FileStore} from "./FileStore.js";

export class UserRepository {
    private users: User[] = [{id: 1, username: 'admin'}, {id: 2, username: 'user1'}];
    private store = new FileStore(path.resolve(process.cwd(), "users.txt"));

    getAll(): User[] {
        return [...this.users];
    }

    getById(id: number): User | null {
        const user = this.users.find((u) => u.id === id);
        return user ?? null;
    }

    deleteById(id: number): User | null {
        const idx = this.users.findIndex((u) => u.id === id);
        if (idx === -1) return null;

        const deleted = this.users[idx];
        this.users.splice(idx, 1);
        this.save();
        return deleted ?? null;
    }

    create(user: User): boolean {
        if (this.users.findIndex((item) => item.id === user.id) !== -1) {
            return false;
        }
        this.users.push(user);
        this.save();
        return true;
    }

    update(user: User): User | null {
        const idx = this.users.findIndex((u) => u.id === user.id);
        if (idx === -1) return null;

        this.users[idx] = user;
        this.save();
        return user; // this.users[idx]
    }

    //=======================================================
    save() {
        try {
          this.store.writeText(JSON.stringify(this.users));
            return "ok"
        } catch (e) {
            return "Write error"
        }
    }

    restore(): string {
        try {
            const raw = this.store.readText();
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