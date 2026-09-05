import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { InsightRow } from "@/components/ai/AIInsightCard";
import { useApp } from "@/context/AppContext";
import { QUICK_PROMPTS } from "@/data/aiResponses";
import { INSIGHTS, REVENUE_TREND, CATEGORY_PERFORMANCE } from "@/data/insights";
import { generateBusinessInsight } from "@/services/mockAI";
import type { ChatMessage } from "@/types";

type View = "chat" | "insights";

function nowLabel() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function Assistant() {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "assistant",
      text: `Namaste ${user.name.split(" ")[0]}! How can I help your business today?`,
      time: nowLabel(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [view, setView] = useState<View>("chat");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  async function send(text: string) {
    if (!text.trim() || thinking) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text, time: nowLabel() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    const reply = await generateBusinessInsight(text);
    setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", text: reply, time: nowLabel() }]);
    setThinking(false);
  }

  return (
    <AppShell>
      <Header title="AI Business Manager" subtitle="Ask anything about your business" />

      <div className="mb-2 flex gap-2 px-4">
        {(
          [
            { key: "chat", label: "Chat", icon: MessageCircle },
            { key: "insights", label: "Insights", icon: TrendingUp },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              view === t.key
                ? "border-(--color-green-700) bg-(--color-green-700) text-(--color-cream)"
                : "border-(--color-line) bg-(--color-surface) text-(--color-ink-soft)"
            }`}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      {view === "insights" ? (
        <div className="space-y-5 px-4 pb-6">
          <div className="card-craft bg-(--color-surface) p-4 shadow-craft">
            <p className="mb-3 text-sm font-semibold text-(--color-ink)">Revenue Trend</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={REVENUE_TREND}>
                <CartesianGrid stroke="#e6d8bd" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8d7f6b" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e6d8bd", fontSize: 12 }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#a8461f" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card-craft bg-(--color-surface) p-4 shadow-craft">
            <p className="mb-3 text-sm font-semibold text-(--color-ink)">Category Performance (views)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={CATEGORY_PERFORMANCE} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  width={80}
                  tick={{ fontSize: 11, fill: "#5b4e3d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e6d8bd", fontSize: 12 }} />
                <Bar dataKey="views" fill="#305c3c" radius={[0, 8, 8, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2.5">
            <p className="eyebrow">AI Insights</p>
            {INSIGHTS.map((i) => (
              <InsightRow key={i.id} title={i.title} detail={i.detail} metric={i.metric} trend={i.trend} />
            ))}
          </div>
        </div>
      ) : (
      <div className="flex h-[calc(100dvh-13rem)] flex-col px-4 md:h-[calc(100dvh-9.5rem)]">
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-craft ${
                  m.role === "user"
                    ? "rounded-br-sm bg-(--color-green-700) text-(--color-cream)"
                    : "rounded-bl-sm bg-(--color-surface) text-(--color-ink)"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-(--color-surface) px-4 py-3 shadow-craft">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-(--color-ink-faint)"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="grid grid-cols-1 gap-2 pt-2">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => send(q.question)}
                  className="flex items-center gap-2 rounded-2xl border border-(--color-line) bg-(--color-surface) px-4 py-3 text-left text-sm font-medium text-(--color-ink-soft) shadow-craft transition-transform active:scale-[0.98]"
                >
                  <Sparkles className="size-3.5 shrink-0 text-(--color-terracotta-600)" />
                  {q.question}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-(--color-line)/70 py-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask about price, sales, buyers..."
            className="w-full rounded-full border border-(--color-line) bg-(--color-surface) px-4 py-3 text-sm focus:border-(--color-green-700) focus:outline-none"
          />
          <button
            onClick={() => send(input)}
            aria-label="Send"
            disabled={!input.trim() || thinking}
            className="tap-target flex shrink-0 items-center justify-center rounded-full bg-(--color-terracotta-600) text-(--color-cream) shadow-craft disabled:opacity-50"
          >
            <Send className="size-4.5" />
          </button>
        </div>
      </div>
      )}
    </AppShell>
  );
}
