import { createContext, FC, useEffect, useState } from "react";
import { ImageUser } from "../interfaces/ImageUser";

interface IImageAuthContext {
    user: ImageUser | null;
    users: ImageUser[] | null;
    setUser: (user: ImageUser | null) => void;
    setUsers: (users: ImageUser[] | null) => void;
}

export const ImageAuthContext = createContext<IImageAuthContext>({
    user: null,
    users: null,
    setUser: () => {},
    setUsers: () => {}
});

export const ImageAuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<ImageUser | null>(null);
    const [users, setUsers] = useState<ImageUser[] | null>(null);

    useEffect(() => {
        const _users = localStorage.getItem('imgUsers');
        const _user = localStorage.getItem('imgUser');

        if (_users) setUsers(JSON.parse(_users));
        if (_user) setUser(JSON.parse(_user));
    }, []);
    
    return (
        <ImageAuthContext.Provider value={{
            user,
            users,
            setUser,
            setUsers
        }}>
            { children }
        </ImageAuthContext.Provider>
    );
};