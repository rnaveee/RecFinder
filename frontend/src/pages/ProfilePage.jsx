import { CURRENT_USER } from "../data/placeholder";

export default function ProfilePage() {
  const user = CURRENT_USER;

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-black dark:text-white">Profile</h1>
        <button className="px-4 py-[5px] rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Edit
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-xl font-semibold text-green-700 dark:text-green-400 shrink-0">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="text-lg font-semibold text-black dark:text-white">{user.name}</p>
          {user.location && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.location}</p>
          )}
        </div>
      </div>

      {user.bio && (
        <p className="text-sm text-black dark:text-white mb-6 leading-relaxed">{user.bio}</p>
      )}

      <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-5">
        {user.age && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Age</span>
            <span className="text-black dark:text-white">{user.age}</span>
          </div>
        )}
        {user.socials && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Socials</span>
            <span className="text-green-700 dark:text-green-400">{user.socials}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Friends</span>
          <span className="text-black dark:text-white">3</span>
        </div>
      </div>

      {user.sports.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800 mt-5 pt-5">
          <p className="text-sm font-semibold text-black dark:text-white mb-3">Sports</p>
          <div className="flex flex-wrap gap-2">
            {user.sports.map((sport) => (
              <span
                key={sport}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40"
              >
                {sport}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
