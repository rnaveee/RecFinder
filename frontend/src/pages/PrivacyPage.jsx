export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 pb-32 sm:pb-8">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-1">Privacy Policy</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">Last updated: June 2026</p>

            <div className="space-y-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">What we collect</h2>
                    <ul className="space-y-1 list-disc list-inside">
                        <li>Account information: name and email address</li>
                        <li>Profile information you choose to add: age, bio, location, sports, social handles</li>
                        <li>Activity: games you create or join, friend connections, chat messages</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">How we use it</h2>
                    <p>Your data is used solely to operate RecFinder — to authenticate your account, display your profile, and power app features. We do not sell your data or share it with third parties.</p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Data storage</h2>
                    <p>Data is stored in a PostgreSQL database. As RecFinder is in beta, data may be reset or deleted during development. Do not store sensitive information in your profile.</p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Your rights</h2>
                    <p>You can request deletion of your account and associated data at any time by contacting <a href="mailto:ryannave97@gmail.com" className="text-green-600 dark:text-green-500 hover:underline">ryannave97@gmail.com</a>.</p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Contact</h2>
                    <p>Questions about this policy? Email <a href="mailto:ryannave97@gmail.com" className="text-green-600 dark:text-green-500 hover:underline">ryannave97@gmail.com</a>.</p>
                </section>
            </div>
        </div>
    );
}
