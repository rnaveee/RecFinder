import { FRIENDS, FRIEND_REQUESTS } from "../data/placeholder";

export default function FriendsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Friends
      </h1>

      {FRIEND_REQUESTS.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Pending requests ({FRIEND_REQUESTS.length})
          </h2>
          <div className="space-y-2">
            {FRIEND_REQUESTS.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center text-sm font-medium">
                    {req.friendName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {req.friendName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">
                    Accept
                  </button>
                  <button className="px-3 py-1 rounded-md text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Your friends ({FRIENDS.length})
        </h2>
        {FRIENDS.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            No friends yet. Join a game and meet people!
          </p>
        ) : (
          <div className="space-y-2">
            {FRIENDS.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
              >
                <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 flex items-center justify-center text-sm font-medium">
                  {f.friendName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {f.friendName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
