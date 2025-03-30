import api from "./config";

export const getavatar = async (name: string) => {
    const response = await api.get(`/avatars/${name}`);
    return response;
};