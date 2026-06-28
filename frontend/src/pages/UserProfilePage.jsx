import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, getFriendships, getSentRequests, getPendingRequests, sendFriendRequest, withdrawFriendRequest, removeFriend, acceptFriendRequest } from "../api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";

export default function UserProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);
    const { addToast } = useToast();

    const [profile, setProfile] = useState(null);
    const [friendStatus, setFriendStatus] = useState(null); // "friends" | "sent" | "pending" | null
    const [friendshipId, setFriendshipId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmFriends, setConfirmFriends] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate("/login"); return; }
        if (Number(id) === user.id) { navigate("/profile"); return; }

        Promise.all([getUser(id), getFriendships(), getSentRequests(), getPendingRequests()])
            .then(([profileData, friends, sent, pending]) => {
                setProfile(profileData);

                const friendship = friends.find(f => f.requesterId === Number(id) || f.addresseeId === Number(id));
                if (friendship) { setFriendStatus("friends"); setFriendshipId(friendship.id); return; }

                const sentReq = sent.find(r => r.addresseeId === Number(id));
                if (sentReq) { setFriendStatus("sent"); setFriendshipId(sentReq.id); return; }

                const pendingReq = pending.find(r => r.requesterId === Number(id));
                if (pendingReq) { setFriendStatus("pending"); setFriendshipId(pendingReq.id); return; }

                setFriendStatus(null);
            })
            .catch(() => navigate("/scrimmages"))
            .finally(() => setLoading(false));
    }, [id, authLoading]);

    async function handleAddFriend() {
        try {
            const req = await sendFriendRequest(Number(id));
            setFriendStatus("sent");
            setFriendshipId(req.id);
        } catch {
            addToast("Couldn't send friend request.", "error");
        }
    }

    async function handleWithdraw() {
        await withdrawFriendRequest(friendshipId);
        setFriendStatus(null);
        setFriendshipId(null);
    }

    async function handleAccept() {
        await acceptFriendRequest(friendshipId);
        setFriendStatus("friends");
    }

    async function handleRemove() {
        await removeFriend(friendshipId);
        setFriendStatus(null);
        setFriendshipId(null);
    }

    if (loading) return <LoadingScreen />;
    if (!profile) return null;

    return (
        <div className="max-w-[935px] sm:mx-auto px-4 py-8 pb-32 sm:pb-8">
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                <div className="sm:w-56 shrink-0">
                    <div className="flex flex-col sm:flex-col items-center sm:items-start gap-4 mb-6">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-4xl font-semibold text-green-700 dark:text-green-400 shrink-0">
                            {profile.name.charAt(0)}
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-xl font-semibold text-black dark:text-white">{profile.name}</p>
                            {profile.location && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.location}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        {friendStatus === null && (
                            <button onClick={handleAddFriend} className="w-full py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                                Add friend
                            </button>
                        )}
                        {friendStatus === "sent" && (
                            <button
                                onMouseEnter={() => setConfirmCancel(true)}
                                onMouseLeave={() => setConfirmCancel(false)}
                                onClick={() => confirmCancel ? handleWithdraw() : setConfirmCancel(true)}
                                className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${confirmCancel ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"}`}
                            >
                                {confirmCancel ? "Cancel" : "Request sent"}
                            </button>
                        )}
                        {friendStatus === "pending" && (
                            <button onClick={handleAccept} className="w-full py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                                Accept request
                            </button>
                        )}
                        {friendStatus === "friends" && (
                            <button
                                onMouseEnter={() => setConfirmFriends(true)}
                                onMouseLeave={() => setConfirmFriends(false)}
                                onClick={() => confirmFriends ? handleRemove() : setConfirmFriends(true)}
                                className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${confirmFriends ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"}`}
                            >
                                {confirmFriends ? "Remove" : "Friends"}
                            </button>
                        )}
                    </div>

                    {profile.sports && profile.sports.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Sports</p>
                            <div className="flex flex-wrap gap-1.5">
                                {[...profile.sports].map(sport => (
                                    <span key={sport} className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40">
                                        {sport}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    {profile.bio && (
                        <p className="text-base text-black dark:text-white mb-6 leading-relaxed">{profile.bio}</p>
                    )}
                    <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-5">
                        {profile.age && (
                            <div className="flex gap-6 text-sm">
                                <span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Age</span>
                                <span className="text-black dark:text-white">{profile.age}</span>
                            </div>
                        )}
                        {profile.socials && (
                            <div className="flex gap-6 text-sm">
                                <span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Socials</span>
                                <span className="text-green-700 dark:text-green-400">{profile.socials}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
