import type {User} from "./users.js";

let users: User[] = [{id:1, username:'admin'}, {id:2, username:'user1'}];

export const getAllUsers = () => [...users];

export const addUser = (user: User) => {
    if (users.findIndex((item) => item.id === user.id) !== -1) {
        return false;
    }
    users.push(user);
    return true;
}
// Получить одного по id
export const getUserById = (id: number): User | null => {
    const user = users.find((u) => u.id === id);
    return user ?? null;
};
// Удалить
export const removeUser = (id: number): User | null => {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    const deleted = users[idx];
    users.splice(idx, 1);
    return deleted ?? null;
};

// Обновить
export const updateUser = (user: User): User | null => {
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return null;

    users[idx] = user;
    return users[idx];
};