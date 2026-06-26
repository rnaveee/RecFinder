import { useState } from "react";
import { Link } from "react-router-dom";

export default function BetaBanner() {
    const [dismissed, setDismissed] = useState(
        () => localStorage.getItem("betaDismissed") === "true"
    );

    if (dismissed) return null;

    function dismiss() {
        localStorage.setItem("betaDismissed", "true");
        setDismissed(true);
    }

    return (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800/40 px-4 py-2 flex items-center justify-between gap-4">
            <p className="text-xs text-green-800 dark:text-green-300 text-center flex-1">
                This app is in early release. Found a bug?{" "}
                <Link to="/support" className="font-semibold underline underline-offset-2 hover:text-green-900 dark:hover:text-green-200 transition-colors">
                    Support
                </Link>
                {" "}— feedback is appreciated.
            </p>
            <button
                onClick={dismiss}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors shrink-0 text-lg leading-none"
                aria-label="Dismiss"
            >
                &times;
            </button>
        </div>
    );
}
