import { useState } from "react";
import { Link } from "react-router-dom";

export default function AppBanner() {
    const [dismissed, setDismissed] = useState(
        () => localStorage.getItem("appBannerDismissed") === "true"
    );

    if (dismissed) return null;

    function dismiss() {
        localStorage.setItem("appBannerDismissed", "true");
        setDismissed(true);
    }

    return (
        <div className="bg-green-600 dark:bg-green-700 px-4 py-2 flex items-center justify-between gap-4">
            <p className="text-xs text-white text-center flex-1">
                Get this as an app!{" "}
                <Link to="/install" className="font-semibold underline underline-offset-2 hover:text-green-100 transition-colors">
                    Install RecFinder →
                </Link>
            </p>
            <button
                onClick={dismiss}
                className="text-green-200 hover:text-white transition-colors shrink-0 text-lg leading-none"
                aria-label="Dismiss"
            >
                &times;
            </button>
        </div>
    );
}
