import { useParams, Link } from "react-router-dom";
import ChatPanel from "../components/ChatPanel";
import { SCRIMMAGES, ATTENDEES, SCRIMMAGE_MESSAGES } from "../data/placeholder";

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ScrimmageDetailPage() {
  const { id } = useParams();
  const scrimmage = SCRIMMAGES.find((s) => s.id === Number(id));

  if (!scrimmage) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Game not found</h1>
        <Link to="/scrimmages" className="text-green-600 hover:text-green-700 dark:text-green-400 text-sm">
          Back to browse
        </Link>
      </div>
    );
  }

  const isFull = scrimmage.attendeeCount >= scrimmage.maxPlayers;
  const attendees = ATTENDEES.filter((a) => a.scrimmageId === scrimmage.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/scrimmages" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4 inline-block">
        &larr; Back to browse
      </Link>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6 bg-white dark:bg-gray-900">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 mb-2">
              {scrimmage.sport}
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {scrimmage.location}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">{scrimmage.city}</p>
          </div>

          <button
            disabled={isFull}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isFull
                ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isFull ? "Full" : "Join game"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 py-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">When</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{formatDateTime(scrimmage.startTime)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Cost</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {scrimmage.attendanceCost > 0 ? `$${scrimmage.attendanceCost}` : "Free"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Players</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {scrimmage.attendeeCount} / {scrimmage.maxPlayers}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Created by</p>
            <p className="text-sm text-gray-900 dark:text-gray-100">{scrimmage.createdByName}</p>
          </div>
        </div>

        {attendees.length > 0 && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Attendees ({attendees.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {attendees.map((a) => (
                <span
                  key={a.id}
                  className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {a.userName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <ChatPanel
          messages={SCRIMMAGE_MESSAGES.filter((m) => m.scrimmageId === scrimmage.id)}
          title={`Chat — ${scrimmage.location}`}
        />
      </div>
    </div>
  );
}
