"use client";

import { Bot } from "lucide-react";

import Button from "@/app/_components/ui/Button";
import { ASK_EVENT } from "@/app/_components/chat/ChatWidget";

// "Ask a question" on a service page: opens the site's assistant already
// pointed at this service, with questions about it ready to tap. It talks to
// the widget through one window event so neither needs to know where the
// other sits in the tree. Only rendered when the chat is configured; the page
// checks that, so this button never opens a chat that cannot answer.

export default function AskAboutService({ title }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="lg"
      onClick={() => window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: { topic: title } }))}
    >
      <Bot className="h-5 w-5" />
      Ask a question
    </Button>
  );
}
