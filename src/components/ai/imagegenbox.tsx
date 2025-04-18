import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Button from "@/components/simpleui/Button/button";
import {TextArea} from "@/components/simpleui/TextArea/textArea";
import styles from "./chatbox.module.scss"
import { useRef} from "react";
import {useSSEImageGen} from "@/hooks/useSSEImageGen";

export default function ImageGenBox() {
    const { messages, input, setInput, sendMessage, loading } = useSSEImageGen()
    const chatRef = useRef<HTMLDivElement>(null)

    return (
        <div className={styles['chat-wrapper']}>
            <div className={styles['chat-container']}
                 ref={chatRef}
            >
                {messages.map((msg, i) => {
                    return (
                        <div className={msg.role === "user" ? styles['chat-bubble-user'] : styles['chat-bubble-ai']} key={i} style={{marginBottom: 12}}>
                            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
                            <div style={{marginLeft: 10}}>
                                {msg.role === "user" ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content.replace(/\\n/g, '\n')}</ReactMarkdown> :
                                    <img src={`data:image/png;base64, ${msg.content}`} alt="AI generated" style={{maxWidth: "100%", maxHeight: "400px"}} /> }
                            </div>
                        </div>
                    );
                })}
                {loading && <div className={styles["typing-indicator"]}><span>AI is typing...</span> <Shimmer /></div>}
            </div>
            <div className={styles["message-input-container"]}>
                {loading && <div className={styles["typing-indicator"]}><span>AI is typing...</span> <Shimmer /></div>}
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
