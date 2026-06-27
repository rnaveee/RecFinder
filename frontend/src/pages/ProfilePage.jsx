import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { getFriendships, updateCurrentUser } from "../api.js";
import { useToast } from "../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";

export default function ProfilePage() {
    const [friendships, setFriendships] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(null);
    const { user, setUser, loading: authLoading } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate("/login"); return; }
        getFriendships()
            .then(res => setFriendships(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [authLoading]);

    if (loading) return <LoadingScreen />;
    if (error) return <p>{error}</p>;
    if (!user) return null;

    function startEditing() {
        setForm({
            name: user.name || "",
            age: user.age != null ? String(user.age) : "",
            bio: user.bio || "",
            socials: user.socials || "",
            location: user.location || "",
            sports: user.sports && user.sports.length > 0 ? [...user.sports] : [""],
        });
        setEditing(true);
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const body = {
            name: form.name,
            age: form.age ? parseInt(form.age) : null,
            bio: form.bio || null,
            socials: form.socials || null,
            location: form.location || null,
            sports: form.sports
                .map(s => s.trim()).filter(Boolean)
                .map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        };

        try {
            const updated = await updateCurrentUser(body);
            setUser(updated);
            setEditing(false);
        } catch {
            addToast("Couldn't save your profile. Please try again.", "error");
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500";
    const labelClass = "block text-xs font-semibold text-black dark:text-white mb-1.5";

    if (editing) {
        return (
            <div className="max-w-[935px] mx-auto px-4 py-6 pb-32 sm:pb-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-black dark:text-white">Edit profile</h1>
                    <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-[5px] rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="sm:grid sm:grid-cols-2 sm:gap-10">
                        {/* Left column */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className={labelClass}>Name</label>
                                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="age" className={labelClass}>Age</label>
                                <input id="age" name="age" type="number" min="1" value={form.age} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="location" className={labelClass}>Location</label>
                                <input id="location" name="location" type="text" value={form.location} onChange={handleChange} placeholder="e.g. Austin, TX" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="socials" className={labelClass}>Socials</label>
                                <input id="socials" name="socials" type="text" value={form.socials} onChange={handleChange} placeholder="e.g. @your_handle" className={inputClass} />
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-4 mt-4 sm:mt-0">
                            <div>
                                <label htmlFor="bio" className={labelClass}>Bio</label>
                                <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Tell people about yourself" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Sports</label>
                                <div className="space-y-2">
                                    {form.sports.map((sport, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={sport}
                                                onChange={(e) => {
                                                    const updated = [...form.sports];
                                                    updated[i] = e.target.value;
                                                    setForm({ ...form, sports: updated });
                                                }}
                                                placeholder="e.g. Basketball"
                                                className={inputClass}
                                            />
                                            {form.sports.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({ ...form, sports: form.sports.filter((_, j) => j !== i) })}
                                                    className="px-2.5 py-1 text-sm text-red-500 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-[3px] hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, sports: [...form.sports, ""] })}
                                        className="text-xs font-semibold text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                                    >
                                        + Add sport
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button type="submit" className="w-full sm:w-48 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-[935px] sm:mx-auto px-4 py-8 pb-32 sm:pb-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-black dark:text-white">Profile</h1>
                <button
                    onClick={startEditing}
                    className="px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Edit profile
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                {/* Left: avatar + name + sports */}
                <div className="sm:w-56 shrink-0">
                    <div className="flex flex-col sm:flex-col items-center sm:items-start gap-4 mb-6">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-4xl font-semibold text-green-700 dark:text-green-400 shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-xl font-semibold text-black dark:text-white">{user.name}</p>
                            {user.location && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.location}</p>
                            )}
                        </div>
                    </div>

                    {user.sports && user.sports.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Sports</p>
                            <div className="flex flex-wrap gap-1.5">
                                {user.sports.map((sport) => (
                                    <span
                                        key={sport}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40"
                                    >
                                        {sport}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: bio + stats */}
                <div className="flex-1">
                    {user.bio && (
                        <p className="text-base text-black dark:text-white mb-6 leading-relaxed">{user.bio}</p>
                    )}
                    <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-5">
                        {user.age && (
                            <div className="flex gap-6 text-sm">
                                <span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Age</span>
                                <span className="text-black dark:text-white">{user.age}</span>
                            </div>
                        )}
                        {user.socials && (
                            <div className="flex gap-6 text-sm">
                                <span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Socials</span>
                                <span className="text-green-700 dark:text-green-400">{user.socials}</span>
                            </div>
                        )}
                        <div className="flex gap-6 text-sm">
                            <span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">Friends</span>
                            <span className="text-black dark:text-white">{friendships.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
