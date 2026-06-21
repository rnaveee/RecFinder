import { useParams, Link } from "react-router-dom";
import ChatPanel from "../components/ChatPanel";
import { SCRIMMAGES, ATTENDEES, SCRIMMAGE_MESSAGES } from "../data/placeholder";

function formatDateTime(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ScrimmageDetailPage() {
  const { id } = useParams();
  const scrimmage = SCRIMMAGES.find((s) => s.id === Number(id));

  if (!scrimmage) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
        <p className="text-sm text-black dark:text-white font-semibold mb-2">Game not found</p>
        <Link to="/scrimmages" className="text-sm text-green-600 dark:text-green-500">
          Back to browse
        </Link>
      </div>
    );
  }

  const isFull = scrimmage.attendeeCount >= scrimmage.maxPlayers;
  const attendees = ATTENDEES.filter((a) => a.scrimmageId === scrimmage.id);

  return (
    <div className="max-w-[600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Link to="/scrimmages" className="text-sm text-black dark:text-white">
          &larr;
        </Link>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 flex items-center justify-center text-[10px] font-semibold shrink-0">
            {scrimmage.sport.slice(0, 3).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-black dark:text-white truncate">{scrimmage.location}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{scrimmage.city}</p>
          </div>
        </div>
        <button
          disabled={isFull}
          className={`text-sm font-semibold transition-colors ${
            isFull
              ? "text-gray-300 dark:text-neutral-600 cursor-not-allowed"
              : "text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400"
          }`}
        >
          {isFull ? "Full" : "Join"}
        </button>
      </div>

      {/* Details */}
      <div className="px-4 py-4 space-y-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">When</span>
          <span className="text-sm text-black dark:text-white">{formatDateTime(scrimmage.startTime)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Sport</span>
          <span className="text-sm text-black dark:text-white">{scrimmage.sport}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Cost</span>
          <span className="text-sm text-black dark:text-white">{scrimmage.attendanceCost > 0 ? `$${scrimmage.attendanceCost}` : "Free"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Players</span>
          <span className="text-sm text-black dark:text-white">{scrimmage.attendeeCount} / {scrimmage.maxPlayers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Host</span>
          <span className="text-sm text-black dark:text-white">{scrimmage.createdByName}</span>
        </div>
      </div>

      {/* Attendees */}
      {attendees.length > 0 && (
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm font-semibold text-black dark:text-white mb-3">
            {attendees.length} attending
          </p>
          <div className="flex gap-4">
            {attendees.map((a) => (
              <div key={a.id} className="flex flex-col items-center gap-1">
                <div className="w-[56px] h-[56px] rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300 ring-2 ring-gray-200 dark:ring-gray-700">
                  {a.userName.charAt(0)}
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 max-w-[60px] truncate">
                  {a.userName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat */}
      <ChatPanel
        messages={SCRIMMAGE_MESSAGES.filter((m) => m.scrimmageId === scrimmage.id)}
        title={`Game chat`}
      />
    </div>
  );
}
