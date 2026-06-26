import { useEffect, useState, useContext } from "react";
import { getFriendships, getPendingRequests, getSentRequests, acceptFriendRequest, declineFriendRequest, withdrawFriendRequest, removeFriend } from "../api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function FriendsPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return;
        if (!user) navigate("/login");
    }, [user, authLoading]);
    const [friendships, setFriendships] = useState([]);
    const [pending, setPending] = useState([]);
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmRemove, setConfirmRemove] = useState(null);

    useEffect(() => {
        Promise.all([getFriendships(), getPendingRequests(), getSentRequests()])
            .then(([friendshipData, pendingData, sentData]) => {
                setFriendships(friendshipData);
                setPending(pendingData);
                setSent(sentData);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleAccept(id) {
        const accepted = await acceptFriendRequest(id);
        setPending(pending.filter(r => r.id !== id));
        setFriendships([...friendships, accepted]);
    }

    async function handleDecline(id) {
        await declineFriendRequest(id);
        setPending(pending.filter(r => r.id !== id));
    }

    async function handleWithdraw(id) {
        await withdrawFriendRequest(id);
        setSent(sent.filter(r => r.id !== id));
    }

    async function handleRemove() {
        await removeFriend(confirmRemove.id);
        setFriendships(friendships.filter(f => f.id !== confirmRemove.id));
        setConfirmRemove(null);
    }

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="max-w-[935px] sm:mx-auto">
            {confirmRemove && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white dark:bg-gray-950 rounded-xl shadow-xl p-6 w-full max-w-sm">
                        <p className="text-sm font-semibold text-black dark:text-white mb-1">Remove friend?</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                            Are you sure you want to remove <span className="font-semibold text-black dark:text-white">{confirmRemove.name}</span>?
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirmRemove(null)}
                                className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRemove}
                                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {sent.length > 0 && (
                <div className="border-b border-gray-100 dark:border-gray-800">
                    <p className="px-4 pt-4 pb-2 text-sm font-semibold text-black dark:text-white">
                        Sent
                    </p>
                    {sent.map((req) => (
                        <div key={req.id} className="flex items-center gap-3 px-4 py-3">
                            <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400 shrink-0">
                                {req.addresseeName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-black dark:text-white">
                                    <span className="font-semibold">{req.addresseeName}</span>
                                    <span className="text-gray-500 dark:text-gray-400"> pending</span>
                                </p>
                            </div>
                            <button onClick={() => handleWithdraw(req.id)} className="px-4 py-[5px] rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
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
                    friendships.map((f) => {
                        const friendName = f.requesterId === user.id ? f.addresseeName : f.requesterName;
                        return (
                            <div key={f.id} className="flex items-center gap-3 px-4 py-3">
                                <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400 shrink-0 ring-2 ring-green-100 dark:ring-green-900/30">
                                    {friendName.charAt(0)}
                                </div>
                                <span className="flex-1 text-sm font-semibold text-black dark:text-white">
                                    {friendName}
                                </span>
                                <button
                                    onClick={() => setConfirmRemove({ id: f.id, name: friendName })}
                                    className="px-4 py-[5px] rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
