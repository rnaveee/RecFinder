import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4">
            <div className="max-w-sm text-center">
                <img src="/logo.png" alt="RecFinder" className="w-20 h-20 mx-auto mb-4" />
                <h1 className="text-3xl font-semibold text-black dark:text-white mb-2 tracking-tight">
                    RecFinder
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                    Find and join local pickup games, open gyms, and scrimmages near you.
                </p>

                <div className="space-y-3">
                    <Link
                        to="/scrimmages"
                        className="block w-full py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                        Browse games
                    </Link>
                    <Link
                        to="/register"
                        className="block w-full py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-black dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                        Create account
                    </Link>
                </div>

                <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-600 dark:text-green-500 font-semibold">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
