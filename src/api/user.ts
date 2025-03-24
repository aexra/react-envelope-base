import { User } from '../interfaces/User';
import api from './config';

export const me = async () => {
    const response = await api.get("/users-me");
    return response;
};

export const update = async (id: string, data: User) => {
    const response = await api.put(`/users/${id}`, data);
    return response;
};