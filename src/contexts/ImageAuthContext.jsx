import { createContext, useEffect, useState } from "react";

export const ImageAuthContext = createContext();

export const ImageAuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [users, setUsers] = useState();

    useEffect(() => {
        const _users = localStorage.getItem('imageUsers');
        const _user = localStorage.getItem('imageUser');

        if (_users) setUsers(JSON.parse(_users));
        if (_user) setUser(JSON.parse(_user));
    }, []);
    
    return (
        <ImageAuthContext.Provider value={[
            user,
            users,
            setUser,
            setUsers
        ]}>
            { children }
        </ImageAuthContext.Provider>
    );
};