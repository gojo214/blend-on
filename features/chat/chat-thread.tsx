"use client"

import Image from "next/image"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

import { ChatComposer } from "@/features/chat/chat-composer"

const greetingMessage: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hey there! I'm your game-building copilot. Tell me what kind of game you want to create and I'll start putting it together.",
    },
  ],
}

type ChatThreadProps = {
  gameId: string
  /** Persisted thread for this game (one game = one chat). Falls back to a greeting when empty. */
  initialMessages?: UIMessage[]
}

export function ChatThread({ gameId, initialMessages = [] }: ChatThreadProps) {
  const [prompt, setPrompt] = useState("")
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { gameId },
    }),
    messages: initialMessages.length > 0 ? initialMessages : [greetingMessage],
  })

  const lastMessage = messages[messages.length - 1]
  const isStreaming = status === "submitted" || status === "streaming"

  const handleSendMessage = (message: string) => {
    sendMessage({ text: message })
    setPrompt("")
  }

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <div className="flex size-full min-h-0 flex-col gap-4">
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-4 text-2xl">
              {messages.map((message) => {
                const isUser = message.role === "user"
                const text = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("")

                return (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.id === lastMessage.id}
                  >
                    <Message align={isUser ? "end" : "start"}>
                      {!isUser && (
                        <MessageAvatar>
                          <Image
                            src="/logo.png"
                            alt="Assistant"
                            width={32}
                            height={32}
                            className="size-8 object-cover"
                          />
                        </MessageAvatar>
                      )}
                      <MessageContent>
                        <Bubble
                          variant={isUser ? "secondary" : "ghost"}
                          align={isUser ? "end" : "start"}
                        >
                          <BubbleContent>{text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )
              })}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="end" />
        </MessageScroller>
        <div className="shrink-0">
          <ChatComposer
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={handleSendMessage}
            disabled={isStreaming}
            placeholder="Describe the game you want to build…"
          />
        </div>
      </div>
    </MessageScrollerProvider>
  )
}
