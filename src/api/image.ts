import api from "./config";

export const getavatar = async (name: string) => {
    const response = await api.get(`images/avatars/${name}`);
    return response;
};