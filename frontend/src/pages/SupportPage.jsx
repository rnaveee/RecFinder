import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function SupportPage() {
    const { user } = useContext(AuthContext);
    const [type, setType] = useState("Bug");
    const [message, setMessage] = useState("");

    const inputClass = "w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500";

    function handleSubmit(e) {
        e.preventDefault();
        const from = user ? `From: ${user.name} (${user.email})\n\n` : "";
        const body = encodeURIComponent(`${from}Type: ${type}\n\n${message}`);
        const subject = encodeURIComponent(`RecFinder ${type} Report`);
        window.location.href = `mailto:ryannave97@gmail.com?subject=${subject}&body=${body}`;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-1">Support</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Report a bug or share feedback. This opens your mail client with the details pre-filled.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-black dark:text-white mb-1">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={inputClass}
                    >
                        <option>Bug</option>
                        <option>Feedback</option>
                        <option>Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-black dark:text-white mb-1">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={6}
                        placeholder="Describe the issue or feedback..."
                        className={inputClass}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-[7px] rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                    Send message!
                </button>
            </form>
        </div>
    );
}
