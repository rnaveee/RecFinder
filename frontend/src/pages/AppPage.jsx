export default function AppPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 pb-32 sm:pb-8">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">Get the App</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Install RecFinder on your phone — no App Store required.</p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-1">iPhone (Safari)</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Must use Safari — Chrome on iOS does not support installation.</p>
                    <ol className="space-y-3">
                        {[
                            "Open recfinder.ca in Safari.",
                            'Tap the Share button at the bottom of the screen (the box with an arrow pointing up).',
                            'Scroll down and tap "Add to Home Screen".',
                            'Tap "Add" in the top right.',
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                                    {i + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-1">Android (Chrome)</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Chrome may show an automatic "Install" banner at the bottom — tap it to skip the steps below.</p>
                    <ol className="space-y-3">
                        {[
                            "Open recfinder.ca in Chrome.",
                            'Tap the three-dot menu in the top right.',
                            'Tap "Add to Home screen" or "Install app".',
                            'Tap "Add".',
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                                    {i + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="border-t border-gray-100 dark:border-gray-800 pt-8">
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">What you get</h2>
                    <ul className="space-y-2">
                        {[
                            "Opens fullscreen — no browser bar",
                            "Icon on your home screen like a native app",
                            "Faster load times on repeat visits",
                            "Always up to date — no manual updates needed",
                        ].map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="text-green-600 dark:text-green-500 mt-0.5 shrink-0">✓</span>
                                {f}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
