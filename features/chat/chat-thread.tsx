"use client"

import Image from "next/image"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

import { ChatComposer } from "@/features/chat/chat-composer"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Hey there! I'm your game-building copilot. Tell me what kind of game you want to create and I'll start putting it together.",
  },
  {
    id: "m2",
    role: "user",
    content:
      "I want a voxel survival shooter where you mine resources and fight waves of enemies.",
  },
  {
    id: "m3",
    role: "assistant",
    content:
      "Nice pick! I'm starting with a destructible voxel world, resource mining, and a wave-based enemy spawner. Want it single-player or co-op?",
  },
  {
    id: "m4",
    role: "user",
    content: "Co-op with friends, plus a creative mode where we can build freely.",
  },
  {
    id: "m5",
    role: "assistant",
    content:
      "Awesome — I've wired up co-op spawning and a survival/creative toggle. The world generator is ready to go. Chat when you want to take it for a spin!",
  },
]

export function ChatThread() {
  const lastMessage = mockMessages[mockMessages.length - 1]

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <div className="flex size-full min-h-0 flex-col gap-4">
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent>
              {mockMessages.map((message) => {
                const isUser = message.role === "user"

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
                          <BubbleContent>{message.content}</BubbleContent>
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
          <ChatComposer />
        </div>
      </div>
    </MessageScrollerProvider>
  )
}