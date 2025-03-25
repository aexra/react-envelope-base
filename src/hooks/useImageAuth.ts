import { useContext } from "react";
import { ImageAuthContext } from "../contexts/ImageAuthContext";
import { ImageUser } from "../interfaces/ImageUser";
import { useObjectLocalStorage } from "../react-envelope/hooks/useObjectLocalStorage";

export const useImageAuth = () => {
    const { user, users, lockTimer: lock, attempts, setUser, setUsers, setLockTimer, setAttempts } = useContext(ImageAuthContext);
    const { setItem } = useObjectLocalStorage();

    const login = (name: string, password: string): ImageUser | null => {
        if (users) {
            const acc = users.find(u => u.name === name && u.password === password);
            if (acc) {
                if (user) setUsers([...users, user]);
                setUser(acc);
                const nu = users.filter(u => u != acc);
                setUsers(nu);
                setItem('imgUser', acc);
                setItem('imgUsers', nu);
                return acc;
            }
        }
        return null;
    };

    const logout = () => {
        if (users && user) {
            const nu = [...users, user];
            setUsers(nu);
            setUser(null);

            setItem('imgUser', null);
            setItem('imgUsers', nu);
        }
    };

    const register = (name: string, password: string): ImageUser | null => {
        if (users) {
            if (users.find(u => u.name === name)) {
                return null;
            } else {
                const nu = [...users, {name, password}];
                setUsers(nu);
                setItem('imgUsers', nu);
                return {name, password};
            }
        } else {
            const nu = [{name, password}];
            setUsers(nu);
            setItem('imgUsers', nu);
            return {name, password};
        }
    };

    const lockUser = (seconds: number) => {
        setLockTimer(seconds);
        setItem('lock', seconds);
    };

    const countAttempt = () => {
        const v = attempts + 1;
        setAttempts(v);
        setItem('attempts', v);
    };

    const resetAttempts = () => {
        setAttempts(0);
        setItem('attempts', 0);
    };

    return { user, users, lock, attempts, login, logout, register, lockUser, countAttempt, resetAttempts };
};