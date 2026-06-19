import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreateScrimmagePage() {
  const [form, setForm] = useState({
    sport: "",
    city: "",
    location: "",
    startTime: "",
    attendanceCost: "0",
    maxPlayers: "10",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: hook up to POST /api/scrimmages
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link to="/scrimmages" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4 inline-block">
        &larr; Back to browse
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create a game
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sport
          </label>
          <input
            id="sport"
            name="sport"
            type="text"
            value={form.sport}
            onChange={handleChange}
            required
            placeholder="e.g. Basketball"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="e.g. Austin"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Zilker Park Courts"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date & time
          </label>
          <input
            id="startTime"
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="attendanceCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cost ($)
            </label>
            <input
              id="attendanceCost"
              name="attendanceCost"
              type="number"
              min="0"
              step="0.01"
              value={form.attendanceCost}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max players
            </label>
            <input
              id="maxPlayers"
              name="maxPlayers"
              type="number"
              min="2"
              value={form.maxPlayers}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
        >
          Create game
        </button>
      </form>
    </div>
  );
}
