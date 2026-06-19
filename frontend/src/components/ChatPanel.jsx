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
    <div className="flex flex-col border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-48">
        {localMessages.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          localMessages.map((msg) => {
            const isOwn = msg.senderId === CURRENT_USER.id;
            return (
              <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] ${isOwn ? "order-1" : ""}`}>
                  {!isOwn && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5 ml-1">
                      {msg.senderName}
                    </p>
                  )}
                  <div
                    className={`px-3 py-2 rounded-lg text-sm ${
                      isOwn
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p className={`text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 ${isOwn ? "text-right mr-1" : "ml-1"}`}>
                    {formatTime(msg.sentAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-gray-100 dark:border-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
