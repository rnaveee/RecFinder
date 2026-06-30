import { useParams, Link, useNavigate } from "react-router-dom";
import ChatPanel from "../components/ChatPanel";
import {useState, useEffect, useContext} from "react";
import {getAttendees, getScrimmage, joinScrimmage, leaveScrimmage, deleteScrimmage, sendFriendRequest, getSentRequests, getFriendships} from "../api.js";
import {AuthContext} from "../context/AuthContext.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";


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
    const navigate = useNavigate();
    const [scrimmage, setScrimmage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [addedIds, setAddedIds] = useState(new Set());
    const [copied, setCopied] = useState(false);
    const { user, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        if (authLoading) return;
        const publicFetches = [getScrimmage(id), getAttendees(id)];
        const allFetches = user
            ? [getSentRequests(), getFriendships(), ...publicFetches]
            : [Promise.resolve([]), Promise.resolve([]), ...publicFetches];

        Promise.all(allFetches)
            .then(([sentData, friendsData, scrimmageData, attendeesData]) => {
                setScrimmage(scrimmageData);
                setAttendees(attendeesData);
                const sentIds = sentData.map(r => r.addresseeId);
                const friendIds = friendsData.map(f => f.requesterId === user?.id ? f.addresseeId : f.requesterId);
                setAddedIds(new Set([...sentIds, ...friendIds]));
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id, authLoading]);

    if (loading) {
        return <LoadingScreen />;
    }
    if (error) {
        return <p>{error}</p>;
    }

    if (!scrimmage) {
        return (
            <div className="max-w-[935px] mx-auto px-4 py-16 text-center">
                <p className="text-sm text-black dark:text-white font-semibold mb-2">Game not found</p>
                <Link to="/scrimmages" className="text-sm text-green-600 dark:text-green-500">
                    Back to browse
                </Link>
            </div>
        );
    }

    const isFull = scrimmage.attendeeCount >= scrimmage.maxPlayers;
    const isAttending = attendees.some(a => a.userId === user?.id);
    const isCreator = user?.id === scrimmage.createdById;

    const shareText = `Join this scrimmage at ${scrimmage.location}! https://recfinder.ca/scrimmages/${id}`;

    function handleCopy() {
        navigator.clipboard.writeText(shareText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    async function handleDelete() {
        if (!confirm("Delete this scrimmage?")) return;
        await deleteScrimmage(id);
        navigate("/scrimmages");
    }

    async function handleJoinLeave() {
        if(!user){
            navigate("/login");
            return;
        }
        if (isAttending) {
            await leaveScrimmage(id);
        } else {
            await joinScrimmage(id);
        }
        const [scrimmageData, attendeesData] = await Promise.all([getScrimmage(id), getAttendees(id)]);
        setScrimmage(scrimmageData);
        setAttendees(attendeesData);

    }

    return (
        <div className="w-full px-2 sm:px-30 pb-32 sm:pb-0">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
                <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">Share with friends:</p>
                <p className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate">{shareText}</p>
                <button
                    onClick={handleCopy}
                    className="shrink-0 px-3 py-1 text-xs font-semibold rounded-md border border-green-200 dark:border-green-800 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                    {copied ? "Copied to clipboard!" : "Copy"}
                </button>
            </div>

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
                    onClick={handleJoinLeave}
                    disabled={isFull && !isAttending}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md border transition-colors ${
                        isFull && !isAttending
                            ? "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-neutral-600 cursor-not-allowed"
                            : isAttending
                                ? "border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                : "border-green-200 dark:border-green-800 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    }`}
                >
                    {isAttending ? "Leave" : isFull ? "Full" : "Join"}
                </button>
            </div>

            <div className="sm:flex sm:divide-x sm:divide-gray-100 dark:sm:divide-gray-800">
                <div className="sm:w-52 shrink-0">
                    <div className="px-4 py-4 space-y-3 border-b border-gray-100 dark:border-gray-800">
                        {scrimmage.isPrivate && (
                            <span className="block w-fit mx-auto px-3 py-2 text-xs font-semibold rounded-[3px] border border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400">
                                🔒 Private game
                            </span>
                        )}
                        <div className="flex gap-6 text-sm">
                            <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">When</span>
                            <span className="text-black dark:text-white">{formatDateTime(scrimmage.startTime)}</span>
                        </div>
                        <div className="flex gap-6 text-sm">
                            <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">Sport</span>
                            <span className="text-black dark:text-white">{scrimmage.sport}</span>
                        </div>
                        <div className="flex gap-6 text-sm">
                            <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">Cost</span>
                            <span className="text-black dark:text-white">{scrimmage.attendanceCost > 0 ? `$${scrimmage.attendanceCost}` : "Free"}</span>
                        </div>
                        <div className="flex gap-6 text-sm">
                            <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">Players</span>
                            <span className="text-black dark:text-white">{scrimmage.attendeeCount} / {scrimmage.maxPlayers}</span>
                        </div>
                        <div className="flex mb-3 gap-6 text-sm">
                            <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">Host</span>
                            <span className="text-black dark:text-white">{scrimmage.createdByName}</span>
                        </div>
                        {isCreator && (
                            <div className="flex gap-2 mt-1.5 pt-2">
                                <button
                                    onClick={() => navigate(`/scrimmages/${id}/edit`)}
                                    className="px-5 py-2 text-sm font-semibold rounded-[3px] border border-gray-200 dark:border-gray-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-5 py-2 text-sm font-semibold rounded-[3px] border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {attendees.length > 0 && (
                        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 sm:border-b-0">
                            <p className="text-sm font-semibold text-black dark:text-white mb-3">
                                {attendees.length} attending
                            </p>
                            <div className="flex gap-4 flex-wrap">
                                {attendees.map((a) => (
                                    <div key={a.id} className="flex flex-col items-center gap-1">
                                        <Link to={a.userId === user?.id ? "/profile" : `/users/${a.userId}`}>
                                            <div className="w-[56px] h-[56px] rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300 ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-green-300 dark:hover:ring-green-700 transition-all">
                                                {a.userName.charAt(0)}
                                            </div>
                                        </Link>
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 max-w-[60px] truncate">
                                            {a.userName}
                                        </span>
                                        {user && a.userId !== user.id && !addedIds.has(a.userId) && (
                                            <button
                                                onClick={async () => {
                                                    try { await sendFriendRequest(a.userId); } catch { /* already friends/pending */ }
                                                    setAddedIds(prev => new Set(prev).add(a.userId));
                                                }}
                                                className="px-2 py-0.5 text-[10px] font-semibold rounded border border-green-200 dark:border-green-800 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                            >
                                                + Add
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <ChatPanel scrimmageId={scrimmage.id} />
                </div>
            </div>
        </div>
    );
}
