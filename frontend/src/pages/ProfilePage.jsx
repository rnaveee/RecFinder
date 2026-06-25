import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { getFriendships, updateCurrentUser } from "../api.js";

export default function ProfilePage() {
    const [friendships, setFriendships] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(null);
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        getFriendships()
            .then(res => setFriendships(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;
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
            alert("Error updating profile");
        }
    }

    const inputClass = "w-full px-3 py-[9px] rounded-[3px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-xs focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500";

    if (editing) {
        return (
            <div className="max-w-[600px] mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-black dark:text-white">Edit profile</h1>
                    <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-[5px] rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-black dark:text-white mb-1">Name</label>
                        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-xs font-semibold text-black dark:text-white mb-1">Age</label>
                        <input id="age" name="age" type="number" min="1" value={form.age} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-xs font-semibold text-black dark:text-white mb-1">Location</label>
                        <input id="location" name="location" type="text" value={form.location} onChange={handleChange} placeholder="e.g. Austin, TX" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-xs font-semibold text-black dark:text-white mb-1">Bio</label>
                        <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Tell people about yourself" className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="socials" className="block text-xs font-semibold text-black dark:text-white mb-1">Socials</label>
                        <input id="socials" name="socials" type="text" value={form.socials} onChange={handleChange} placeholder="e.g. @your_handle" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-black dark:text-white mb-1">Sports</label>
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
                                            className="px-2 text-sm text-red-500 hover:text-red-700 transition-colors"
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
                    <button type="submit" className="w-full py-[7px] rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors mt-1">
                        Save changes
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-[600px] mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-black dark:text-white">Profile</h1>
                <button
                    onClick={startEditing}
                    className="px-4 py-[5px] rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
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
                    <span className="text-black dark:text-white">{friendships.length}</span>
                </div>
            </div>

            {user.sports && user.sports.length > 0 && (
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
