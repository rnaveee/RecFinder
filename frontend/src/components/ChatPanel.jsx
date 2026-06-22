import { useState, useRef, useEffect } from "react";
import { CURRENT_USER } from "../data/placeholder";

function formatTime(iso) {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function ChatPanel({ messages, title }) {
    const [input, setInput] = useState("");
    const [localMessages, setLocalMessages] = useState(messages);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [localMessages]);

    function handleSend(e) {
        e.preventDefault();
        if (!input.trim()) return;
        setLocalMessages([
            ...localMessages,
            {
                id: Date.now(),
                senderId: CURRENT_USER.id,
                senderName: CURRENT_USER.name,
                content: input.trim(),
                sentAt: new Date().toISOString(),
            },
        ]);
        setInput("");
    }

    return (
        <div className="flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
            {title && (
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                        {title.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-black dark:text-white">{title}</span>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 max-h-80 min-h-48 bg-gray-50/50 dark:bg-gray-950">
                {localMessages.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                        No messages yet
                    </p>
                ) : (
                    localMessages.map((msg) => {
                        const isOwn = msg.senderId === CURRENT_USER.id;
                        return (
                            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                <div className="max-w-[75%]">
                                    {!isOwn && (
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5 ml-3">
                                            {msg.senderName}
                                        </p>
                                    )}
                                    <div
                                        className={`px-3 py-2 text-sm ${
                                            isOwn
                                                ? "bg-green-600 text-white rounded-[20px] rounded-br-[4px]"
                                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-black dark:text-white rounded-[20px] rounded-bl-[4px]"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                    <p className={`text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 ${isOwn ? "text-right mr-2" : "ml-3"}`}>
                                        {formatTime(msg.sentAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="text-sm font-semibold text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors disabled:opacity-30 disabled:cursor-default"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
