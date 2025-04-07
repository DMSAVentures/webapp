import { useSSEChat } from "@/hooks/useSSEChat"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Button from "@/components/simpleui/Button/button";
import {TextArea} from "@/components/simpleui/TextArea/textArea";
import styles from "./chatbox.module.scss"

export default function ChatBox() {
    const { messages, input, setInput, sendMessage, loading } = useSSEChat()

    return (
        <div>
            <h2>⚡ Gemini Chat Mock</h2>

            <div
                style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 16,
                    minHeight: 200,
                    marginBottom: 20,
                    background: "#f9f9f9",
                }}
            >
                {messages.map((msg, i) => {
                    const normalizedContent = msg.content.replace(/\\n/g, '\n')
                    return (
                        <div key={i} style={{marginBottom: 12}}>
                            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
                            <div style={{marginLeft: 10}}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{normalizedContent}</ReactMarkdown>
                            </div>
                        </div>
                    );
                })}
                {loading && <div className={styles["typing-indicator"]}><span>AI is typing...</span> <Shimmer /></div>}
            </div>
            <div className={styles["message-input-container"]}>
                <TextArea
                    label={""}
                    required={true}
                    placeholder="Type your message here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <Button className={styles["button"]}
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                >
                    Send
                </Button>
            </div>
        </div>
    )
}


function Shimmer() {
    return (
        <span className={styles["shimmer-block"]}>
      <span className={styles["shimmer"]} />
    </span>
    )
}
