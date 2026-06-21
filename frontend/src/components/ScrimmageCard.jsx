import { Link } from "react-router-dom";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function ScrimmageCard({ scrimmage }) {
  const isFull = scrimmage.attendeeCount >= scrimmage.maxPlayers;

  return (
    <Link
      to={`/scrimmages/${scrimmage.id}`}
      className="block py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-semibold shrink-0">
          {scrimmage.sport.slice(0, 3).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-black dark:text-white truncate">
              {scrimmage.location}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {scrimmage.city} · {scrimmage.sport}
          </span>
        </div>
        <span className={`text-xs tabular-nums ${isFull ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
          {scrimmage.attendeeCount}/{scrimmage.maxPlayers}
        </span>
      </div>

      <div className="pl-[52px] flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span>{formatDate(scrimmage.startTime)} at {formatTime(scrimmage.startTime)}</span>
        <span>·</span>
        <span>{scrimmage.attendanceCost > 0 ? `$${scrimmage.attendanceCost}` : "Free"}</span>
      </div>
    </Link>
  );
}
