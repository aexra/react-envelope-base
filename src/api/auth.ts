import { Auth } from '../interfaces/Auth';
import { User } from '../interfaces/User';
import api from './config';

export const login = async (login: string, password: string) => {
    const response = await api.post(`/account/login`, {
        email: login,
        password: password
    });
    return response;
};

export const register = async (auth: { login: string, password: string }, user: User) => {
    const response = await api.post(`/account/register`, {
        firstname: user.firstname, 
        lastname: user.lastname, 
        middlename: user.middlename, 
        email: auth.login, 
        password: auth.password
    });
    return response;
};
