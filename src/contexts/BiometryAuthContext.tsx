import React, { createContext, useEffect, useState } from "react";
import { BiometryUser } from "../interfaces/BiometryUser";
import { useObjectLocalStorage } from "../react-envelope/hooks/useObjectLocalStorage";
import { useInterval } from "../react-envelope/hooks/useInterval";

interface IBiometryAuthContext {
    biometryUser: BiometryUser | null;
    biometryUsers: BiometryUser[];
    isBiometryLoading: boolean;
    lockTimer: number;
    attempts: number;
    setBiometryUser: (user: BiometryUser | null) => void;
    setBiometryUsers: (users: BiometryUser[]) => void;
    resetBiometryAuth: () => void;
    setLockTimer: (timer: number) => void;
    setAttempts: (a: number) => void;
}

export const BiometryAuthContext = createContext<IBiometryAuthContext>({
    biometryUser: null,
    biometryUsers: [],
    isBiometryLoading: true,
    lockTimer: 0,
    attempts: 0,
    setBiometryUser: () => { },
    setBiometryUsers: () => { },
    resetBiometryAuth: () => { },
    setLockTimer: () => { },
    setAttempts: () => { }
});

export const BiometryAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [biometryUser, setBiometryUser] = useState<BiometryUser | null>(null);
    const [biometryUsers, setBiometryUsers] = useState<BiometryUser[]>([]);
    const [isBiometryLoading, setIsBiometryLoading] = useState(true);

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

    const { getItem, setItem } = useObjectLocalStorage();

    useEffect(() => {
        // Загрузка текущего пользователя
        const currentUser = getItem('currentBiometryUser');
        if (currentUser) {
            setBiometryUser(currentUser);
        }

        // Загрузка всех пользователей
        const storedUsers = getItem('biometryUsers') || [];
        if (storedUsers.length < 1) setItem('biometryUsers', []);
        setBiometryUsers(storedUsers);

        const _lock = localStorage.getItem('lock');
        const _attempts = localStorage.getItem('attempts');

        if (_lock) setLockTimer(JSON.parse(_lock));
        if (_attempts) setAttempts(JSON.parse(_attempts));

        setIsBiometryLoading(false);
    }, []);

    const resetBiometryAuth = () => {
        setBiometryUser(null);
        setBiometryUsers([]);
    };

    return (
        <BiometryAuthContext.Provider value={{
            biometryUser,
            biometryUsers,
            isBiometryLoading,
            lockTimer,
            attempts,
            setBiometryUser,
            setBiometryUsers,
            resetBiometryAuth,
            setLockTimer,
            setAttempts
        }}>
            {children}
        </BiometryAuthContext.Provider>
    );
};