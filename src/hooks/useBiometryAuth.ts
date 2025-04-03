import { useContext } from "react";
import { BiometryAuthContext } from "../contexts/BiometryAuthContext";
import { BiometryUser } from "../interfaces/BiometryUser";
import { useObjectLocalStorage } from "../react-envelope/hooks/useObjectLocalStorage";

export const useBiometryAuth = () => {
    const { 
        biometryUser, 
        biometryUsers,
        isBiometryLoading, 
        setBiometryUser, 
        setBiometryUsers,
        resetBiometryAuth 
    } = useContext(BiometryAuthContext);
    
    const { getItem, setItem, removeItem } = useObjectLocalStorage();
    const STORAGE_KEY = "biometryUsers";

    // Загрузка пользователей при инициализации
    const loadUsers = () => {
        const storedUsers = getItem(STORAGE_KEY) || [];
        setBiometryUsers(storedUsers);
        return storedUsers;
    };

    // Регистрация нового пользователя
    const register = (name: string, phrase: string, interval: number = 300): BiometryUser | null => {
        const users = loadUsers();
        
        if (users.some((u: { name: string; }) => u.name === name)) {
            return null; // Пользователь уже существует
        }

        const newUser: BiometryUser = { name, phrase, interval };
        const updatedUsers = [...users, newUser];
        
        setBiometryUsers(updatedUsers);
        setItem(STORAGE_KEY, updatedUsers);
        return newUser;
    };

    // Вход пользователя
    const login = (name: string, phrase: string): BiometryUser | null => {
        const users = loadUsers();
        const user = users.find((u: { name: string; phrase: string; }) => u.name === name && u.phrase === phrase);
        
        if (user) {
            setBiometryUser(user);
            setItem('currentBiometryUser', user);
            return user;
        }
        
        return null;
    };

    // Выход пользователя
    const logout = (): void => {
        setBiometryUser(null);
        removeItem('currentBiometryUser');
    };

    // Удаление пользователя
    const unregister = (name: string): void => {
        const users = loadUsers();
        const updatedUsers = users.filter((u: { name: string; }) => u.name !== name);
        
        setBiometryUsers(updatedUsers);
        setItem(STORAGE_KEY, updatedUsers);
        
        if (biometryUser?.name === name) {
            logout();
        }
    };

    // Обновление интервала для текущего пользователя
    const updateInterval = (interval: number): boolean => {
        if (!biometryUser) return false;
        
        const updatedUser = { ...biometryUser, interval };
        const users = loadUsers().map((u: { name: string; }) => 
            u.name === biometryUser.name ? updatedUser : u
        );
        
        setBiometryUser(updatedUser);
        setBiometryUsers(users);
        setItem(STORAGE_KEY, users);
        setItem('currentBiometryUser', updatedUser);
        
        return true;
    };

    return {
        currentUser: biometryUser,
        allUsers: biometryUsers,
        isLoading: isBiometryLoading,
        register,
        login,
        logout,
        unregister,
        updateInterval,
        loadUsers
    };
};