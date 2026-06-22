import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { handleRegister } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await handleRegister(name, email, password);
            navigate("/scrimmages");
        } catch {
            alert("ERROR AT REGISTER PAGE");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-4">
            <div className="w-full max-w-[350px]">
                <div className="border border-gray-200 dark:border-gray-800 px-10 py-8">
                    <h1 className="text-3xl font-semibold text-black dark:text-white mb-2 text-center tracking-tight">
                        RecFinder
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 leading-snug">
                        Sign up to find and create pickup games near you.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Full name"
                            className="w-full px-3 py-[9px] rounded-[3px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-xs focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email"
                            className="w-full px-3 py-[9px] rounded-[3px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-xs focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Password"
                            className="w-full px-3 py-[9px] rounded-[3px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-xs focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            className="w-full py-[7px] rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors mt-2"
                        >
                            Sign up
                        </button>
                    </form>

                    <p className="mt-4 text-xs text-center text-gray-400 dark:text-gray-500 leading-relaxed">
                        By signing up, you agree to find some games and have fun.
                    </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 px-10 py-5 mt-3 text-center">
                    <p className="text-sm text-black dark:text-white">
                        Have an account?{" "}
                        <Link to="/login" className="text-green-600 dark:text-green-500 font-semibold">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
