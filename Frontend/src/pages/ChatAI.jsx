
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";

const ChatAI = () => {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const messageIdRef = useRef(3);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            text: "Hi, I can help with ideas, edge cases, and debugging hints for this problem.",
        },
        {
            id: 2,
            role: "assistant",
            text: "Send a short question and I’ll reply with a simple, useful answer.",
        },
    ]);

    const suggestions = useMemo(
        () => ["Explain the logic", "Find edge cases", "Give me a hint"],
        []
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);

    const pushReply = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const nextId = messageIdRef.current;
        messageIdRef.current += 2;

        const userMessage = {
            id: nextId,
            role: "user",
            text: trimmed,
        };

        const assistantMessage = {
            id: nextId + 1,
            role: "assistant",
            text: `Nice question. A simple approach is to break it into smaller steps, test a few examples, and then refine the logic around edge cases for: "${trimmed}".`,
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        pushReply(message);
        setMessage("");
    };

    return (
        <div className="rounded-2xl border border-base-300 bg-gradient-to-br from-base-100 via-base-100 to-base-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-base-300 px-4 py-3 bg-base-200/80">
                <div>
                    <h3 className="text-sm font-bold text-base-content">AI Assistant</h3>
                    <p className="text-xs text-base-content/60">Quick hints for your coding problem</p>
                </div>
                <span className="badge badge-success badge-outline">Ready</span>
            </div>

            <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
                {messages.map((chatMessage) => (
                    <div
                        key={chatMessage.id}
                        className={`chat ${chatMessage.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div
                            className={`chat-bubble max-w-[85%] text-sm leading-relaxed ${chatMessage.role === "user"
                                ? "chat-bubble-primary"
                                : "bg-base-300 text-base-content"
                                }`}
                        >
                            {chatMessage.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-base-300 bg-base-100 p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                    {suggestions.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className="btn btn-xs btn-outline btn-neutral mx-2 hover:bg-stone-600/90 w-32"
                            onClick={() => {
                                pushReply(item);
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        rows={1}
                        placeholder="Ask something about the problem..."
                        className="textarea textarea-bordered p-2 w-full min-h-12 h-12 max-h-12 resize-none leading-5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary h-12 min-h-12 px-4 flex items-center justify-center"
                        disabled={!message.trim()}
                    >
                        <FiSend className="text-lg" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatAI;