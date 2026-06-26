import { useEffect, useRef, useState, useContext } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { api } from "../api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ChatPanel({ scrimmageId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const clientRef = useRef(null);
    const bottomRef = useRef(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        api(`/scrimmages/${scrimmageId}/messages`).then(setMessages).catch(() => {});

        const token = localStorage.getItem("token");
        const client = new Client({
            webSocketFactory: () => new SockJS("/ws"),
            connectHeaders: { Authorization: `Bearer ${token}` },
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("[chat] STOMP connected");
                client.subscribe(`/topic/scrimmages/${scrimmageId}`, (frame) => {
                    setMessages(prev => [...prev, JSON.parse(frame.body)]);
                });
            },
            onStompError: (frame) => {
                console.error("[chat] STOMP error", frame.headers?.message, frame.body);
            },
            onDisconnect: () => {
                console.warn("[chat] STOMP disconnected");
            },
            onWebSocketError: (e) => {
                console.warn("[chat] WebSocket error, falling back", e);
            },
        });

        client.activate();
        clientRef.current = client;
        return () => { client.deactivate(); };
    }, [scrimmageId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function handleSend(e) {
        e.preventDefault();
        if (!input.trim() || !clientRef.current?.connected) return;
        clientRef.current.publish({
            destination: `/app/chat/${scrimmageId}`,
            body: JSON.stringify(input.trim()),
            headers: { "content-type": "application/json" },
        });
        setInput("");
    }

    return (
        <div className="flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-semibold text-black dark:text-white">Game chat</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 max-h-[600px] min-h-64 bg-gray-50/50 dark:bg-gray-950">
                {messages.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No messages yet</p>
                ) : (
                    messages.map((m) => {
                        const isMe = m.userId === user?.id;
                        return (
                            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div className="max-w-[75%]">
                                    {!isMe && (
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5 ml-3">
                                            {m.username}
                                        </p>
                                    )}
                                    <div className={`px-3 py-2 text-sm ${
                                        isMe
                                            ? "bg-green-600 text-white rounded-[20px] rounded-br-[4px]"
                                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-black dark:text-white rounded-[20px] rounded-bl-[4px]"
                                    }`}>
                                        {m.content}
                                    </div>
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
