import { useState } from "react"


type Message = {
    role: "user" | "assistant"
    content: string
}

export function useSSEChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMessage: Message = { role: "user", content: input }
        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)
        setInput("")
        setLoading(true)

        const res = await fetch("http://localhost:8080/api/ai/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/event-stream",
            },
            body: JSON.stringify({ messages: updatedMessages }),
        })

        const reader = res.body?.getReader()
        const decoder = new TextDecoder("utf-8")
        let assistantReply = ""

        while (true) {
            const { value, done } = await reader?.read()!
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            console.log(chunk);
            const lines = chunk.split("\n").filter((line) => line.startsWith("data:"))

            for (const line of lines) {
                const data = line.replace("data: ", "")

                if (data === "[DONE]") {
                    // setMessages((prev) => [
                    //     ...prev,
                    //     { role: "assistant", content: assistantReply },
                    // ])
                    setLoading(false)
                    return
                }

                assistantReply += data
                setMessages((prev) => {
                    const others = prev.filter((msg) => msg.role !== "assistant")
                    return [...others, { role: "assistant", content: assistantReply }]
                })
            }
        }
    }

    return {
        messages,
        input,
        setInput,
        sendMessage,
        loading,
    }
}
