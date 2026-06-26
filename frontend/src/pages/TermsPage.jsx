export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 pb-32 sm:pb-8">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-1">Terms of Service</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">Last updated: June 2026</p>

            <div className="space-y-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Beta Software</h2>
                    <p>RecFinder is currently in beta. The service is provided as-is, without warranties of any kind. Features may change, data may be reset, and the service may be interrupted at any time without notice.</p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Eligibility</h2>
                    <p>You must be at least 13 years old to use RecFinder. By creating an account, you confirm that you meet this requirement.</p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Acceptable Use</h2>
                    <p>You agree not to use RecFinder to post illegal content, harass other users, or misrepresent event information. Games listed must be real, local, and open to the public.</p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Account Termination</h2>
                    <p>We reserve the right to suspend or delete accounts that violate these terms or that are reported for abuse.</p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Limitation of Liability</h2>
                    <p>RecFinder is not responsible for events that take place at games listed on the platform. Attendance is at your own risk. We do not verify the safety or accuracy of user-submitted game information.</p>
                </section>

                <section>
                    <h2 className="text-sm font-semibold text-black dark:text-white mb-2">Contact</h2>
                    <p>Questions? Email <a href="mailto:ryannave97@gmail.com" className="text-green-600 dark:text-green-500 hover:underline">ryannave97@gmail.com</a>.</p>
                </section>
            </div>
        </div>
    );
}
