import { useState } from "react";
import ScrimmageCard from "../components/ScrimmageCard";
import { SCRIMMAGES } from "../data/placeholder";

const ALL_SPORTS = [...new Set(SCRIMMAGES.map((s) => s.sport))].sort();

export default function ScrimmageListPage() {
  const [sport, setSport] = useState("");
  const [city, setCity] = useState("");

  const filtered = SCRIMMAGES.filter((s) => {
    if (sport && s.sport !== sport) return false;
    if (city && !s.city.toLowerCase().includes(city.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="flex-1 px-3 py-[9px] rounded-[3px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-xs focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
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
            className="flex-1 px-3 py-[9px] rounded-[3px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-xs focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      <div className="px-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-16">
            No games found.
          </p>
        ) : (
          filtered.map((s) => (
            <ScrimmageCard key={s.id} scrimmage={s} />
          ))
        )}
      </div>
    </div>
  );
}
