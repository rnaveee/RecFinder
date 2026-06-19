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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Browse games
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All sports</option>
          {ALL_SPORTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-12">
          No games found. Try adjusting your filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <ScrimmageCard key={s.id} scrimmage={s} />
          ))}
        </div>
      )}
    </div>
  );
}
