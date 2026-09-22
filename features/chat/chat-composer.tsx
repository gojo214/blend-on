"use client"

import { type FormEvent } from "react"
import { ArrowUpIcon, ChevronDownIcon, GripIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"

const models = ["Kimi K3", "Claude Opus 5", "GPT-5", "Gemini 3 Pro"]

type ChatComposerProps = {
  value: string
  onValueChange: (value: string) => void
  /** Receives the trimmed prompt; only called when it is non-empty. */
  onSubmit: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatComposer({
  value,
  onValueChange,
  onSubmit,
  disabled = false,
  placeholder = "Describe the game you want to build…",
}: ChatComposerProps) {
  const prompt = value.trim()
  const canSubmit = prompt.length > 0 && !disabled
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    onSubmit(prompt)
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <form onSubmit={handleSubmit}>
        <InputGroup className="bg-popover">
          <InputGroupTextarea
            name="prompt"
            value={value}
            onChange={(event) => onValueChange(event.currentTarget.value)}
            required
            placeholder={placeholder}
            rows={1}
            className="field-sizing-content max-h-48 min-h-10"
          />
          <InputGroupAddon align="block-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <InputGroupButton>
                    <GripIcon />
                    Kimi K3
                    <ChevronDownIcon />
                  </InputGroupButton>
                }
              />
              <DropdownMenuContent className="w-auto">
                {models.map((model) => (
                  <DropdownMenuItem key={model}>{model}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Base UI buttons default to `type="button"`. */}
            <Button
              type="submit"
              size="icon-lg"
              className="ml-auto rounded-full"
            >
              <ArrowUpIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}
