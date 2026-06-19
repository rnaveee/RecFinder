import { Link } from "react-router-dom";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function ScrimmageCard({ scrimmage }) {
  const isFull = scrimmage.attendeeCount >= scrimmage.maxPlayers;

  return (
    <Link
      to={`/scrimmages/${scrimmage.id}`}
      className="block border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-green-300 dark:hover:border-green-700 transition-colors bg-white dark:bg-gray-900"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
          {scrimmage.sport}
        </span>
        <span className={`text-xs font-medium ${isFull ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
          {scrimmage.attendeeCount}/{scrimmage.maxPlayers} players
        </span>
      </div>

      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
        {scrimmage.location}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {scrimmage.city}
      </p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">
          {formatDate(scrimmage.startTime)} at {formatTime(scrimmage.startTime)}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {scrimmage.attendanceCost > 0 ? `$${scrimmage.attendanceCost}` : "Free"}
        </span>
      </div>
    </Link>
  );
}
