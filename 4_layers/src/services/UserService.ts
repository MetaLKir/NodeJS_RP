import type {User} from "../model/users.js";
import {addUser, getAllUsers, getUserById, removeUser, updateUser} from "../model/userRepository.js";

export class UserService {
    getAll(): User[] {
        return getAllUsers();
    }
    getById(id: number) {
        return getUserById(id);
    }
    create(user: User) {
        return addUser(user);
    }
    deleteById(id: number) {
        return removeUser(id);
    }
    update(user: User) {
        return updateUser(user);
    }
}
