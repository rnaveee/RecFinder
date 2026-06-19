import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/scrimmages", label: "Browse", exact: false },
  { to: "/scrimmages/new", label: "Create", exact: true },
  { to: "/messages", label: "Messages", exact: false },
  { to: "/friends", label: "Friends", exact: false },
  { to: "/profile", label: "Profile", exact: false },
];

function isActive(pathname, to, exact) {
  if (exact) return pathname === to;
  if (to === "/scrimmages") return pathname.startsWith(to) && pathname !== "/scrimmages/new";
  return pathname.startsWith(to);
}

export default function Navbar({ user }) {
  const { pathname } = useLocation();

  return (
    <>
      {/* Top bar */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-green-600 text-lg">
            <span className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center text-sm font-bold">
              R
            </span>
            RecFinder
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(pathname, to, exact)
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <button className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors">
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile auth link */}
          <div className="sm:hidden">
            {user ? (
              <button className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400">
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {NAV_LINKS.map(({ to, label, exact }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                isActive(pathname, to, exact)
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
