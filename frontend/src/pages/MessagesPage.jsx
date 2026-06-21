import { useState } from "react";
import ChatPanel from "../components/ChatPanel";
import { DIRECT_CONVERSATIONS } from "../data/placeholder";

function formatRelativeDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diffDays === 1) return "1d";
  if (diffDays < 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}w`;
}

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = DIRECT_CONVERSATIONS.find((c) => c.id === selectedId);

  if (selected) {
    return (
      <div className="max-w-[600px] mx-auto flex flex-col h-[calc(100vh-60px-48px)] sm:h-[calc(100vh-60px)]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setSelectedId(null)}
            className="text-sm text-black dark:text-white"
          >
            &larr;
          </button>
          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-semibold text-gray-500 dark:text-gray-400">
            {selected.otherUserName.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-black dark:text-white">
            {selected.otherUserName}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatPanel messages={selected.messages} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-semibold text-black dark:text-white">Messages</h1>
      </div>

      {DIRECT_CONVERSATIONS.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-16">
          No messages yet.
        </p>
      ) : (
        DIRECT_CONVERSATIONS.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setSelectedId(conv.id)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <div className="w-[56px] h-[56px] rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-semibold text-gray-500 dark:text-gray-400 shrink-0">
              {conv.otherUserName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-black dark:text-white">
                  {conv.otherUserName}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                  {formatRelativeDate(conv.lastMessageAt)}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {conv.lastMessage}
              </p>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
