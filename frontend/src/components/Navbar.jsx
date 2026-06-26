import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const NAV_LINKS = [
    { to: "/scrimmages", label: "Browse", exact: false },
    { to: "/scrimmages/new", label: "Create", exact: true },
    { to: "/friends", label: "Friends", exact: false },
    { to: "/profile", label: "Profile", exact: false },
];

function isActive(pathname, to, exact) {
    if (exact) return pathname === to;
    if (to === "/scrimmages") return pathname.startsWith(to) && pathname !== "/scrimmages/new";
    return pathname.startsWith(to);
}

export default function Navbar({ user, logout }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

    function toggleTheme() {
        const next = !dark;
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
        setDark(next);
    }

    return (
        <>
            <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-[935px] mx-auto px-4 h-[60px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to={user ? "/scrimmages" : "/"} className="flex items-center gap-2">
                            <img src="/logo.png" alt="RecFinder" className="w-8 h-8" />
                            <span className="text-xl font-semibold text-black dark:text-white tracking-tight">RecFinder</span>
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className={`relative w-10 h-[22px] rounded-full transition-colors ${dark ? "bg-green-600" : "bg-gray-300"}`}
                            title={dark ? "Light mode" : "Dark mode"}
                        >
                            <span className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${dark ? "translate-x-[18px]" : "translate-x-0"}`} />
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-5">
                        {NAV_LINKS.map(({ to, label, exact }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`text-sm transition-colors ${
                                    isActive(pathname, to, exact)
                                        ? "text-black dark:text-white font-semibold"
                                        : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                                }`}
                            >
                                {label}
                            </Link>
                        ))}

                        <span className="text-gray-200 dark:text-gray-700">|</span>

                        <Link to="/about" className="text-sm text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                            About
                        </Link>
                        <Link to="/support" className="text-sm text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                            Support
                        </Link>

                        {user ? (
                            <button onClick={() => { logout(); navigate("/login"); }} className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                Log out
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition-colors"
                            >
                                Log in
                            </Link>
                        )}
                    </div>

                    <div className="sm:hidden flex items-center gap-3">
                        {user ? (
                            <button onClick={() => { logout(); navigate("/login"); }} className="text-sm text-gray-500 dark:text-gray-400">
                                Log out
                            </button>
                        ) : (
                            <Link to="/login" className="text-sm font-semibold text-green-600 dark:text-green-500">
                                Log in
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                <div className="relative flex py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                    {(() => {
                        const activeIndex = NAV_LINKS.findIndex(({ to, exact }) => isActive(pathname, to, exact));
                        return activeIndex !== -1 && (
                            <div
                                className="absolute top-1 bottom-1 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-xl transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(${activeIndex * 100}%)` }}
                            />
                        );
                    })()}
                    {NAV_LINKS.map(({ to, label, exact }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`relative z-10 flex-1 text-center px-2 py-1 text-sm transition-colors ${
                                isActive(pathname, to, exact)
                                    ? "text-black dark:text-white font-semibold"
                                    : "text-gray-400 dark:text-gray-500"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center gap-8 pt-3 pb-6 border-t border-gray-100 dark:border-gray-800/60">
                    <Link to="/about" className="text-sm text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">About</Link>
                    <Link to="/support" className="text-sm text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Support</Link>
                    <Link to="/terms" className="text-sm text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Terms</Link>
                    <Link to="/privacy" className="text-sm text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Privacy</Link>
                </div>
            </nav>
        </>
    );
}
