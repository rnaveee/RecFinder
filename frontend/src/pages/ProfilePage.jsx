import { CURRENT_USER } from "../data/placeholder";

export default function ProfilePage() {
  const user = CURRENT_USER;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Profile
      </h1>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.location}</p>
          </div>
        </div>

        {user.bio && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Bio</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{user.bio}</p>
          </div>
        )}

        {user.socials && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Socials</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{user.socials}</p>
          </div>
        )}

        {user.age && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Age</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{user.age}</p>
          </div>
        )}

        {user.sports.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Sports</p>
            <div className="flex flex-wrap gap-2">
              {user.sports.map((sport) => (
                <span
                  key={sport}
                  className="px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>
        )}

        <button className="mt-6 w-full py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Edit profile
        </button>
      </div>
    </div>
  );
}
