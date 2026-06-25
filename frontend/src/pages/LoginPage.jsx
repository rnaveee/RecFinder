import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await handleLogin(email, password);
            navigate("/scrimmages");
        } catch {
            alert("ERROR AT LOGIN PAGE");
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-60px)]">
            {/* Collage side — hidden on mobile */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-950">
                <img
                    src="/recfinder-collage-stacked.png"
                    alt="Pickup basketball games"
                    className="max-h-[calc(100vh-60px)] w-auto object-contain dark:brightness-50"
                />
            </div>

            {/* Form side */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-[350px]">
                    <div className="border border-gray-200 dark:border-gray-800 px-10 py-8">
                        <h1 className="text-3xl font-semibold text-black dark:text-white mb-8 text-center tracking-tight">
                            RecFinder
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-2">
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
                                placeholder="Password"
                                className="w-full px-3 py-[9px] rounded-[3px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-xs focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                className="w-full py-[7px] rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors mt-2"
                            >
                                Log in
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-5">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase">or</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                        </div>

                        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                            Forgot password?
                        </p>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-800 px-10 py-5 mt-3 text-center">
                        <p className="text-sm text-black dark:text-white">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-green-600 dark:text-green-500 font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
