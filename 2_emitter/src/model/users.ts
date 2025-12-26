export type User = {
    id: number;
    username: string;
}

let users: User[] = [
    {id: 1, username: "admin"},
    {id: 2, username: "uborschik"},
]

export const getAllUsers = () => [...users];

export const addUser = (user: User) => {
    if (users.findIndex(item => item.id === user.id) !== -1) {
        return false;
    }
    users.push(user);
    return true;
}

export const deleteUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    users = users.filter(u => u.id !== id);
    return user;
}

export const updateUser = (id: number, data: Partial<Omit<User, "id">>) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    const user = users[index] as User; // it thinks here could be "undefined", so added "as User"

    users[index] = {...user, ...data};
    return users[index];
};

export const getUser = (id: number) => {
    return users.find(user => user.id === id) ?? null;
}

