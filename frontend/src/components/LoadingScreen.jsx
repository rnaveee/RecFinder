export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <img src="/logo.png" alt="RecFinder" className="w-16 h-16 object-contain opacity-80" />
            <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
        </div>
    );
}
