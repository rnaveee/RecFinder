import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext.jsx";

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col gap-2 items-center pointer-events-none">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
}

function Toast({ toast, onRemove }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const show = requestAnimationFrame(() => setVisible(true));
        const fadeOut = setTimeout(() => setVisible(false), 3400);
        const remove = setTimeout(() => onRemove(toast.id), 4000);
        return () => {
            cancelAnimationFrame(show);
            clearTimeout(fadeOut);
            clearTimeout(remove);
        };
    }, [toast.id]);

    const styles = {
        error: "bg-red-600 text-white",
        success: "bg-green-600 text-white",
        info: "bg-gray-800 text-white dark:bg-gray-700",
    };

    return (
        <div
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-sm max-w-[320px] transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"} ${styles[toast.type] ?? styles.info}`}
        >
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button onClick={() => onRemove(toast.id)} className="opacity-70 hover:opacity-100 transition-opacity mt-0.5 shrink-0">
                &times;
            </button>
        </div>
    );
}
