import { createContext, useContext, useState } from "react";

export const ToastContext = createContext(null);


export const ToastProvider = ( { children } ) => {
    const [toasts, setToasts] = useState([])

    function addToast(message, type) {
        setToasts(prev => [...prev, { id: Date.now(), message, type}]);
    }

    function removeToast(id) {
        setToasts(toasts.filter(toast => toast.id !== id));
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );

}

export const useToast = () => useContext(ToastContext);