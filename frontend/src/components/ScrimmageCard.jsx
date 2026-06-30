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
            className="flex gap-3 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors overflow-hidden"
        >
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                {scrimmage.sport.slice(0, 3).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm font-semibold text-black dark:text-white leading-snug break-words min-w-0">{scrimmage.location}</span>
                        {scrimmage.isPrivate && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-[3px] border border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400 shrink-0">
                                🔒 Private
                            </span>
                        )}
                    </div>
                    <span className={`text-xs tabular-nums shrink-0 mt-0.5 ${isFull ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
                        {scrimmage.attendeeCount}/{scrimmage.maxPlayers}
                    </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{scrimmage.city} · {scrimmage.sport}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-2">
                    <span>{formatDate(scrimmage.startTime)} at {formatTime(scrimmage.startTime)}</span>
                    <span>·</span>
                    <span>{scrimmage.attendanceCost > 0 ? `$${scrimmage.attendanceCost}` : "Free"}</span>
                </div>
            </div>
        </Link>
    );
}
