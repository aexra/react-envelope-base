import { useContext } from "react";
import { ImageAuthContext } from "../contexts/ImageAuthContext";
import { ImageUser } from "../interfaces/ImageUser";

export const useImageAuth = () => {
    const { user, users, setUser, setUsers } = useContext(ImageAuthContext);

    const login = (name: string, password: string): ImageUser | null => {
        if (users) {
            const acc = users.find(u => u.name === name && u.password === password);
            if (acc) {
                if (user) setUsers([...users, user]);
                setUser(acc);
                setUsers(users.filter(u => u != acc));
                return acc;
            }
        }
        return null;
    };

    const logout = () => {
        if (users && user) setUsers([...users, user]);
    };

    const register = (name: string, password: string): ImageUser | null => {
        if (users) {
            if (users.find(u => u.name === name)) {
                return null;
            } else {
                setUsers([...users, {name, password}]);
                return {name, password};
            }
        } else {
            setUsers([{name, password}]);
            return {name, password};
        }
    };

    return { user, users, login, logout, register };
};