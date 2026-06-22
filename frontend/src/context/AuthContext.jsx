import { useState, createContext, useEffect } from "react";
import { getCurrentUser, login, register } from "../api.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setLoading(false);
            return;
        }
        getCurrentUser()
            .then(user => setUser(user))
            .catch(error => alert(error.message))
            .finally(() => setLoading(false));
    }, []);

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    async function handleLogin(email, password) {
        const response = await login(email, password);
        localStorage.setItem("token", response.token);
        const user = await getCurrentUser();
        setUser(user);
    }

    async function handleRegister(name, email, password) {
        const response = await register(name, email, password);
        localStorage.setItem("token", response.token);
        const user = await getCurrentUser();
        setUser(user);
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, handleLogin, handleRegister }}>
            {children}
        </AuthContext.Provider>
    );
}
