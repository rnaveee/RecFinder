import { useState } from "react";
import ChatPanel from "../components/ChatPanel";
import { DIRECT_CONVERSATIONS } from "../data/placeholder";

function formatRelativeDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = DIRECT_CONVERSATIONS.find((c) => c.id === selectedId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        {/* Conversation list */}
        <div className={`w-full sm:w-64 shrink-0 space-y-1 ${selected ? "hidden sm:block" : ""}`}>
          {DIRECT_CONVERSATIONS.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
              No conversations yet.
            </p>
          ) : (
            DIRECT_CONVERSATIONS.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedId === conv.id
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-green-300 dark:hover:border-green-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 flex items-center justify-center text-sm font-medium shrink-0">
                    {conv.otherUserName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {conv.otherUserName}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                        {formatRelativeDate(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat area */}
        <div className={`flex-1 min-w-0 ${!selected ? "hidden sm:block" : ""}`}>
          {selected ? (
            <>
              <button
                onClick={() => setSelectedId(null)}
                className="sm:hidden text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-3"
              >
                &larr; Back
              </button>
              <ChatPanel
                messages={selected.messages}
                title={selected.otherUserName}
              />
            </>
          ) : (
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center min-h-80">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Select a conversation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
