import { Auth } from '../interfaces/Auth';
import { User } from '../interfaces/User';
import api from './config';

export const me = async () => {
    const response = await api.get("/users/me");
    return response;
};

export const updateself = async (auth: Auth, user: User) => {
    const response = await api.put(`/users/me`, {
        email: auth.login,
        password: auth.password,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename
    });
    return response;
};

export const updateavatarself = async (file: any) => {
    const response = await api.put("/users/me/avatar", {
        imageFile: file
    });
    return response;
};

export const deleteavatarself = async () => {
    const response = await api.delete("/users/me/avatar");
    return response;
};