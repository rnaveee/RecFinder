import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4">
      <div className="max-w-lg text-center">
        {/* Logo placeholder */}
        <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
          R
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Find your next game
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
          Discover and join local pickup games, open gyms, and scrimmages near you.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/scrimmages"
            className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
          >
            Browse games
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
