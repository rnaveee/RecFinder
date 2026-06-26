export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 pb-32 sm:pb-8">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">About RecFinder</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Beta — actively developed</p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">What is RecFinder?</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        RecFinder helps people find and organize local drop-in sports — pickup basketball, open gyms, casual scrimmages — in their city. Browse open games near you, create your own, and connect with the people you play with.
                    </p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Intended use</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Imagine you're sitting on your bed and want to play basketball with people at your gym. Instead of making a group chat, post it here! Then share it to your friends who want to play.
                    </p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-3">Features</h2>
                    <ul className="space-y-2">
                        {[
                            "Browse open games filtered by sport and city",
                            "Create games with location, time, cost, and player cap",
                            "Join or leave games — live attendee counts",
                            "Real-time in-game chat",
                            "Friend system — connect with people you play with",
                            "User profiles with sports, bio, and social links",
                        ].map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="text-green-600 dark:text-green-500 mt-0.5 shrink-0">✓</span>
                                {f}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="border-t border-gray-100 dark:border-gray-800 pt-8">
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-6">About the developer</h2>
                    <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <div className="relative w-full h-72 sm:h-96 bg-gray-100 dark:bg-gray-800">
                            <img
                                src="/me.png"
                                alt="Ryan Nave"
                                className="w-full h-full object-cover object-[center_20%]"
                            />
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-base font-semibold text-black dark:text-white">Ryan Nave</p>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Hello! My name is Ryan Nave. I currently live in BC, Canada, and I want to pursue a career in software development.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-black dark:text-white mb-1">Why I built this</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    I love playing basketball. The reason why I built this was because I wanted to make it easier for other athletes to play scrimmages with their friends,
                                    or find people to play with! This app also helped me learn more about software and how apps are built, so just using this app and giving feedback helps a lot!
                                </p>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
                                Have feedback?{" "}
                                <a href="/support" className="text-green-600 dark:text-green-500 font-semibold hover:underline">
                                    Let me know.
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
