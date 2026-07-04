
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import axiosClient from "../utils/axiosClient";

const ChatAI = ({ problem }) => {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
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

    const renderInlineText = (text) =>
        text.split(/(`[^`]+`)/g).map((part, index) => {
            if (part.startsWith("`") && part.endsWith("`")) {
                return (
                    <code
                        key={`${part}-${index}`}
                        className="rounded bg-base-300 px-1 py-0.5 text-[0.85em] text-secondary-content"
                    >
                        {part.slice(1, -1)}
                    </code>
                );
            }

            return <span key={`${part}-${index}`}>{part}</span>;
        });

    const isTableDivider = (line) =>
        /^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);

    const splitTableRow = (line) =>
        line
            .trim()
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((cell) => cell.trim());

    const renderAssistantContent = (text) => {
        const lines = text.split(/\r?\n/);
        const nodes = [];
        let index = 0;

        while (index < lines.length) {
            const line = lines[index];

            if (!line.trim()) {
                index += 1;
                continue;
            }

            if (line.trim().startsWith("```")) {
                const codeLines = [];
                index += 1;

                while (index < lines.length && !lines[index].trim().startsWith("```")) {
                    codeLines.push(lines[index]);
                    index += 1;
                }

                if (index < lines.length) {
                    index += 1;
                }

                nodes.push(
                    <pre
                        key={`code-${nodes.length}`}
                        className="mb-3 overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-xs text-slate-100"
                    >
                        <code>{codeLines.join("\n")}</code>
                    </pre>
                );
                continue;
            }

            if (line.includes("|") && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
                const headerCells = splitTableRow(line);
                const rows = [];
                index += 2;

                while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
                    rows.push(splitTableRow(lines[index]));
                    index += 1;
                }

                nodes.push(
                    <div key={`table-${nodes.length}`} className="mb-3 overflow-x-auto rounded-xl border border-base-300">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead className="bg-base-200">
                                <tr>
                                    {headerCells.map((cell) => (
                                        <th key={cell} className="border border-base-300 px-3 py-2 font-semibold text-base-content">
                                            {cell}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIndex) => (
                                    <tr key={`${rowIndex}-${row.join("-")}`}>
                                        {row.map((cell) => (
                                            <td key={cell} className="border border-base-300 px-3 py-2 align-top">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                continue;
            }

            if (/^#{1,3}\s+/.test(line.trim())) {
                const headingLevel = line.match(/^#{1,3}/)[0].length;
                const headingText = line.trim().replace(/^#{1,3}\s+/, "");
                const HeadingTag = headingLevel === 1 ? "h1" : headingLevel === 2 ? "h2" : "h3";

                nodes.push(
                    <HeadingTag
                        key={`heading-${nodes.length}`}
                        className={`mb-2 font-bold ${headingLevel === 1 ? "text-base-content text-lg" : headingLevel === 2 ? "text-base-content text-base" : "text-base-content text-sm"}`}
                    >
                        {renderInlineText(headingText)}
                    </HeadingTag>
                );
                index += 1;
                continue;
            }

            if (/^>\s+/.test(line.trim())) {
                const quoteLines = [];
                while (index < lines.length && /^>\s+/.test(lines[index].trim())) {
                    quoteLines.push(lines[index].trim().replace(/^>\s+/, ""));
                    index += 1;
                }

                nodes.push(
                    <blockquote
                        key={`quote-${nodes.length}`}
                        className="mb-3 border-l-4 border-primary/40 pl-3 italic text-base-content/80"
                    >
                        {quoteLines.map((quoteLine, quoteIndex) => (
                            <div key={`${quoteIndex}-${quoteLine}`}>{renderInlineText(quoteLine)}</div>
                        ))}
                    </blockquote>
                );
                continue;
            }

            if (/^(-\s+|\*\s+|\+\s+)/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())) {
                const ordered = /^\d+\.\s+/.test(line.trim());
                const listItems = [];

                while (
                    index < lines.length &&
                    ((ordered && /^\d+\.\s+/.test(lines[index].trim())) || (!ordered && /^(-\s+|\*\s+|\+\s+)/.test(lines[index].trim())))
                ) {
                    const currentLine = lines[index].trim().replace(/^(-\s+|\*\s+|\+\s+|\d+\.\s+)/, "");
                    listItems.push(currentLine);
                    index += 1;
                }

                const ListTag = ordered ? "ol" : "ul";

                nodes.push(
                    <ListTag
                        key={`list-${nodes.length}`}
                        className={`mb-3 ml-4 space-y-1 ${ordered ? "list-decimal" : "list-disc"}`}
                    >
                        {listItems.map((item, itemIndex) => (
                            <li key={`${itemIndex}-${item}`} className="leading-relaxed">
                                {renderInlineText(item)}
                            </li>
                        ))}
                    </ListTag>
                );
                continue;
            }

            const paragraphLines = [line.trim()];
            index += 1;

            while (
                index < lines.length &&
                lines[index].trim() &&
                !lines[index].trim().startsWith("```") &&
                !/^#{1,3}\s+/.test(lines[index].trim()) &&
                !/^>\s+/.test(lines[index].trim()) &&
                !/^(-\s+|\*\s+|\+\s+)/.test(lines[index].trim()) &&
                !/^\d+\.\s+/.test(lines[index].trim()) &&
                !(lines[index].includes("|") && index + 1 < lines.length && isTableDivider(lines[index + 1]))
            ) {
                paragraphLines.push(lines[index].trim());
                index += 1;
            }

            nodes.push(
                <p key={`p-${nodes.length}`} className="mb-2 last:mb-0 whitespace-pre-wrap">
                    {renderInlineText(paragraphLines.join(" "))}
                </p>
            );
        }

        return <div className="space-y-1">{nodes}</div>;
    };

    const pushReply = async (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        setIsSending(true);

        const nextId = messageIdRef.current;
        messageIdRef.current += 2;

        try {
            const response = await axiosClient.post("/chat/ai", {
                message: trimmed,
                Title: problem.title,
                Description: problem.description,
                TestCases: problem.visibleTestCases,
                Startercode: problem.startCode,
            });

            const assistantReply = response.data?.reply || response.data?.mess || "I got your message, but I couldn't build a reply.";

            const userMessage = {
                id: nextId,
                role: "user",
                text: trimmed,
            };

            const assistantMessage = {
                id: nextId + 1,
                role: "assistant",
                text: assistantReply,
            };

            setMessages((prev) => [...prev, userMessage, assistantMessage]);
        } catch (error) {
            const errorMessage = error.response?.data?.mess || "Failed to get chat response.";

            setMessages((prev) => [
                ...prev,
                {
                    id: nextId,
                    role: "user",
                    text: trimmed,
                },
                {
                    id: nextId + 1,
                    role: "assistant",
                    text: errorMessage,
                },
            ]);
        } finally {
            setIsSending(false);
        }

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
                            {chatMessage.role === "assistant" ? (
                                renderAssistantContent(chatMessage.text)
                            ) : (
                                <div className="whitespace-pre-wrap">{chatMessage.text}</div>
                            )}
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
                        disabled={!message.trim() || isSending}
                    >
                        <FiSend className="text-lg" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatAI;