import { createContext, FC, useEffect, useState, useRef } from "react";
import { ImageUser } from "../interfaces/ImageUser";
import { useInterval } from "../react-envelope/hooks/useInterval";

interface IImageAuthContext {
    user: ImageUser | null;
    users: ImageUser[] | null;
    lockTimer: number;
    attempts: number;
    setUser: (user: ImageUser | null) => void;
    setUsers: (users: ImageUser[] | null) => void;
    setLockTimer: (timer: number) => void;
    setAttempts: (a: number) => void;
}

export const ImageAuthContext = createContext<IImageAuthContext>({
    user: null,
    users: null,
    lockTimer: 0,
    attempts: 0,
    setUser: () => {},
    setUsers: () => {},
    setLockTimer: () => {},
    setAttempts: () => {}
});

export const ImageAuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<ImageUser | null>(null);
    const [users, setUsers] = useState<ImageUser[] | null>(null);
    const [lockTimer, setLockTimer] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const { active, pause, resume, toggle } = useInterval(() => {
        if (lockTimer && lockTimer > 0) {
            const v = lockTimer - 1;
            setLockTimer(v);
            localStorage.setItem("lock", JSON.stringify(v));

            if (v == 0) {
                setAttempts(0);
                localStorage.setItem('attempts', JSON.stringify(0));
            }
        }
    }, 1000);

    useEffect(() => {
        const _users = localStorage.getItem('imgUsers');
        const _user = localStorage.getItem('imgUser');
        const _lock = localStorage.getItem('lock');
        const _attempts = localStorage.getItem('attempts');

        if (_users) setUsers(JSON.parse(_users));
        if (_user) setUser(JSON.parse(_user));
        if (_lock) setLockTimer(JSON.parse(_lock));
        if (_attempts) setAttempts(JSON.parse(_attempts));
    }, []);

    return (
        <ImageAuthContext.Provider value={{
            user,
            users,
            lockTimer,
            attempts,
            setUser,
            setUsers,
            setLockTimer,
            setAttempts
        }}>
            {children}
        </ImageAuthContext.Provider>
    );
};