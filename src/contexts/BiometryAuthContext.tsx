import React, { createContext, useEffect, useState } from "react";
import { BiometryUser } from "../interfaces/BiometryUser";
import { useObjectLocalStorage } from "../react-envelope/hooks/useObjectLocalStorage";

interface IBiometryAuthContext {
    biometryUser: BiometryUser | null;
    biometryUsers: BiometryUser[];
    isBiometryLoading: boolean;
    setBiometryUser: (user: BiometryUser | null) => void;
    setBiometryUsers: (users: BiometryUser[]) => void;
    resetBiometryAuth: () => void;
}

export const BiometryAuthContext = createContext<IBiometryAuthContext>({
    biometryUser: null,
    biometryUsers: [],
    isBiometryLoading: true,
    setBiometryUser: () => {},
    setBiometryUsers: () => {},
    resetBiometryAuth: () => {},
});

export const BiometryAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [biometryUser, setBiometryUser] = useState<BiometryUser | null>(null);
    const [biometryUsers, setBiometryUsers] = useState<BiometryUser[]>([]);
    const [isBiometryLoading, setIsBiometryLoading] = useState(true);
    
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
            setBiometryUser,
            setBiometryUsers,
            resetBiometryAuth
        }}>
            {children}
        </BiometryAuthContext.Provider>
    );
};