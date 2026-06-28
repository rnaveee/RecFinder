import {useContext, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { createScrimmage } from "../api.js";
import { useToast } from "../context/ToastContext.jsx";
import {AuthContext} from "../context/AuthContext.jsx";

export default function CreateScrimmagePage() {
    const [form, setForm] = useState({
        sport: "",
        city: "",
        location: "",
        startTime: "",
        attendanceCost: "0",
        maxPlayers: "10",
        isPrivate: false,
    });

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { addToast } = useToast();

    function handleChange(e) {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if(!user){
            navigate("/login");
            return;
        }
        const body = {
            sport: form.sport.charAt(0).toUpperCase() + form.sport.slice(1),
            city: form.city,
            location: form.location,
            startTime: new Date(form.startTime).toISOString(),
            attendanceCost: parseFloat(form.attendanceCost),
            maxPlayers: parseInt(form.maxPlayers),
            isPrivate: form.isPrivate,
        };

        try {
            await createScrimmage(body);
            navigate("/scrimmages");
        } catch {
            addToast("Couldn't create your game. Please try again.", "error");
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500";

    return (
        <div className="max-w-[935px] mx-auto overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <Link to="/scrimmages" className="text-sm text-black dark:text-white">&larr;</Link>
                <h1 className="text-sm font-semibold text-black dark:text-white">New game</h1>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" className="px-4 py-4 space-y-3">
                <div>
                    <label htmlFor="sport" className="block text-xs font-semibold text-black dark:text-white mb-1">Sport</label>
                    <input id="sport" name="sport" type="text" value={form.sport} onChange={handleChange} required placeholder="e.g. Basketball" className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="city" className="block text-xs font-semibold text-black dark:text-white mb-1">City</label>
                        <input id="city" name="city" type="text" value={form.city} onChange={handleChange} required placeholder="e.g. Austin" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-xs font-semibold text-black dark:text-white mb-1">Location</label>
                        <input id="location" name="location" type="text" value={form.location} onChange={handleChange} placeholder="e.g. Zilker Park Courts" className={inputClass} />
                    </div>
                </div>

                <div className="w-full overflow-hidden">
                    <label htmlFor="startTime" className="block text-xs font-semibold text-black dark:text-white mb-1">Date & time</label>
                    <input id="startTime" name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required className={inputClass} style={{maxWidth: "100%"}} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="attendanceCost" className="block text-xs font-semibold text-black dark:text-white mb-1">Cost ($)</label>
                        <input id="attendanceCost" name="attendanceCost" type="number" min="0" step="0.01" value={form.attendanceCost} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="maxPlayers" className="block text-xs font-semibold text-black dark:text-white mb-1">Max players</label>
                        <input id="maxPlayers" name="maxPlayers" type="number" min="2" value={form.maxPlayers} onChange={handleChange} required className={inputClass} />
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        name="isPrivate"
                        checked={form.isPrivate}
                        onChange={handleChange}
                        className="w-4 h-4 accent-green-600"
                    />
                    <span className="text-sm text-black dark:text-white">Private game (won't appear in public list)</span>
                </label>

                <button type="submit" className="w-full py-[7px] rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors mt-1">
                    Share
                </button>
            </form>
        </div>
    );
}
