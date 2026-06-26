import { useState, useEffect } from "react";
import ScrimmageCard from "../components/ScrimmageCard";
import { getScrimmages } from "../api.js";
import LoadingScreen from "../components/LoadingScreen.jsx";

export default function ScrimmageListPage() {
    const [sport, setSport] = useState("");
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrimmages, setScrimmages] = useState([]);

    useEffect(() => {
        getScrimmages()
            .then(res => setScrimmages(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const ALL_SPORTS = [...new Set(scrimmages.map(s => s.sport))].sort();

    const filtered = scrimmages.filter(s => {
        if (sport && s.sport !== sport) return false;
        return !(city && !s.city.toLowerCase().includes(city.toLowerCase()));
    });

    if (loading) return <LoadingScreen />;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-5xl mx-auto pb-32 sm:pb-0">
            <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={sport}
                        onChange={(e) => setSport(e.target.value)}
                        className="sm:w-44 px-3 py-[9px] rounded-[3px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
                    >
                        <option value="">All sports</option>
                        {ALL_SPORTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="flex-1 px-3 py-[9px] rounded-[3px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>
            </div>

            <div className="px-4 py-3">
                {filtered.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-16">
                        No games found.
                    </p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filtered.map((s) => (
                            <ScrimmageCard key={s.id} scrimmage={s} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
