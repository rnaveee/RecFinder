import { useEffect, useState, useContext } from "react";
import { getFriendships, getPendingRequests, acceptFriendRequest, declineFriendRequest } from "../api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function FriendsPage() {
    const { user } = useContext(AuthContext);
    const [friendships, setFriendships] = useState([]);
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([getFriendships(), getPendingRequests()])
            .then(([friendshipData, pendingData]) => {
                setFriendships(friendshipData);
                setPending(pendingData);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleAccept(id) {
        await acceptFriendRequest(id);
        setPending(pending.filter(r => r.id !== id));
    }

    async function handleDecline(id) {
        await declineFriendRequest(id);
        setPending(pending.filter(r => r.id !== id));
    }

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="max-w-[600px] mx-auto">
            {pending.length > 0 && (
                <div className="border-b border-gray-100 dark:border-gray-800">
                    <p className="px-4 pt-4 pb-2 text-sm font-semibold text-black dark:text-white">
                        Requests
                    </p>
                    {pending.map((req) => (
                        <div key={req.id} className="flex items-center gap-3 px-4 py-3">
                            <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400 shrink-0">
                                {req.requesterName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-black dark:text-white">
                                    <span className="font-semibold">{req.requesterName}</span>
                                    <span className="text-gray-500 dark:text-gray-400"> wants to be friends</span>
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleAccept(req.id)} className="px-4 py-[5px] rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors">
                                    Accept
                                </button>
                                <button onClick={() => handleDecline(req.id)} className="px-4 py-[5px] rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <p className="px-4 pt-4 pb-2 text-sm font-semibold text-black dark:text-white">
                    All friends
                </p>
                {friendships.length === 0 ? (
                    <p className="px-4 py-12 text-sm text-gray-400 dark:text-gray-500 text-center">
                        No friends yet. Join a game and meet people!
                    </p>
                ) : (
                    friendships.map((f) => (
                        <div key={f.id} className="flex items-center gap-3 px-4 py-3">
                            <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400 shrink-0 ring-2 ring-green-100 dark:ring-green-900/30">
                                {(f.requesterId === user.id ? f.addresseeName : f.requesterName).charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-black dark:text-white">
                                {f.requesterId === user.id ? f.addresseeName : f.requesterName}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
