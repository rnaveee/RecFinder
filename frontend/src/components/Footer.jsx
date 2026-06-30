import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="hidden sm:block border-t border-gray-100 dark:border-gray-800 mt-auto py-6 pb-16 px-4">
            <div className="max-w-[935px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 dark:text-gray-500">
                <span className="hidden sm:block text-xs">© {new Date().getFullYear()} Ryan Nave. All rights reserved.</span>
                <div className="flex items-center gap-6 sm:gap-4 text-sm sm:text-xs">
                    <Link to="/install" className="hover:text-black dark:hover:text-white transition-colors">Install</Link>
                    <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
                    <Link to="/support" className="hover:text-black dark:hover:text-white transition-colors">Support</Link>
                    <Link to="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
                    <Link to="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
                </div>
            </div>
        </footer>
    );
}
