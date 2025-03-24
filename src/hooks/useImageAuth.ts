import { useContext } from "react";
import { ImageAuthContext } from "../contexts/ImageAuthContext";

export const useImageAuth = () => {
    const [user, users, setUser, setUsers] = useContext(ImageAuthContext);
    return { user, users, setUser, setUsers };
};