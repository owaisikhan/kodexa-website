"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";

import Link from "next/link";

import { siteConfig } from "@/app/_lib/siteConfig";
import { parseAnswer } from "@/app/_components/chat/linkify";

// The assistant, bottom right. It answers from what the site itself knows and
// says so plainly when a question is outside that.

const GREETING = {
  role: "assistant",
  content:
    "Hi. Ask me what we build, what something includes, or how long it takes. I can only help with Kodexa.",
};

const SUGGESTIONS = [
  "What do you build?",
  "How much does a website cost?",
  "How long does an online store take?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const scroller = useRef(null);
  const inputRef = useRef(null);

  // Follow the conversation as it grows, including while a reply streams in.
  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes it, the way every other dialog on the web behaves.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function ask(question) {
    const text = question.trim();
    if (!text || busy) return;

    setInput("");
    setBusy(true);

    // The history sent is the conversation *before* this question.
    const history = messages
      .filter((m) => m !== GREETING)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "", pending: true },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Chat is unavailable right now.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      // SSE frames are separated by a blank line, and a frame can arrive split
      // across reads, so the tail of the buffer is kept until it completes.
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          const line = frame.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;

          const event = JSON.parse(line.slice(6));
          if (event.type === "token") {
            answer += event.value;
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", content: answer };
              return next;
            });
          } else if (event.type === "error") {
            answer = event.value;
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", content: answer };
              return next;
            });
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: `${err.message} You can always reach us on WhatsApp at ${siteConfig.whatsappDisplay}.`,
        };
        return next;
      });
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Ask Kodexa"
            className="panel fixed bottom-24 right-4 z-50 flex h-[min(560px,70vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden bg-[#101013]/95 sm:right-5"
          >
            <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-[#0c0f02]">
                  <Bot className="h-4 w-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Ask {siteConfig.name}</p>
                  <p className="text-xs text-[var(--color-dim)]">
                    Answers about what we build
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--color-text)]"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* data-lenis-prevent is load-bearing. Lenis takes over the wheel
                for the whole page, so without it a wheel over this list
                scrolls the page behind the chat and the conversation itself
                never moves. Any scrollable panel added later needs it too. */}
            <div
              ref={scroller}
              data-lenis-prevent
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {messages.map((m, i) => (
                <Bubble key={i} message={m} />
              ))}

              {messages.length === 1 ? (
                <div className="space-y-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="flex w-full items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-left text-sm text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-text)]"
                    >
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-[var(--color-border)] p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a service..."
                maxLength={500}
                aria-label="Your question"
                className="field py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)] text-[#0c0f02] transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Ask Kodexa a question"}
        aria-expanded={open}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-[#0c0f02] shadow-[0_12px_40px_-10px_var(--color-primary)] sm:right-5"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </>
  );
}

function Bubble({ message }) {
  const mine = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${mine ? "justify-end" : "justify-start"}`}
    >
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          mine
            ? "rounded-br-sm bg-[var(--color-primary)]/15 text-[var(--color-text)]"
            : "rounded-bl-sm bg-white/[0.05] text-[var(--color-muted)]"
        }`}
      >
        {message.content ? (
          mine ? (
            message.content
          ) : (
            <Linked text={message.content} />
          )
        ) : message.pending ? (
          <Typing />
        ) : null}
      </p>
    </motion.div>
  );
}

// An answer's paths and numbers, turned into things you can tap. Only routes
// that actually exist become links; see linkify.js for why that matters.
function Linked({ text }) {
  return parseAnswer(text).map((part, i) => {
    if (part.type === "link") {
      return (
        <Link
          key={i}
          href={part.href}
          className="mx-0.5 inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)]/15 px-2 py-0.5 font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/25"
        >
          {part.label}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      );
    }

    if (part.type === "external") {
      return (
        <a
          key={i}
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--color-primary)] underline decoration-[var(--color-primary)]/40 underline-offset-2 hover:decoration-[var(--color-primary)]"
        >
          {part.label}
        </a>
      );
    }

    return <span key={i}>{part.value}</span>;
  });
}

function Typing() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-dim)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}
