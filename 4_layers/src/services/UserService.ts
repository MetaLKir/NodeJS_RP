import type {User} from "../model/users.js";
import type {UserRepository} from "../repositories/UserRepository.js";

export class UserService {
    constructor(private repo: UserRepository) {}

    getAll(): User[] {
        return this.repo.getAll();
    }
    getById(id: number) {
        return this.repo.getById(id);
    }
    create(user: User) {
        return this.repo.create(user);
    }
    deleteById(id: number) {
        return this.repo.deleteById(id);
    }
    update(user: User) {
        return this.repo.update(user);
    }
}
