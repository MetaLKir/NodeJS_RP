export type User = {
    id: number;
    username: string;
}

let users: User[] = [
    {id:1, username: "admin"},
    {id:2, username: "uborschik"},
]

export const getAllUsers = () => [...users];

export const addUser = (user: User) => {
    if (users.findIndex(item => item.id === user.id) !== -1) {
        return false;
    }
    users.push(user);
    return true;

}