"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { chatWithCompanion } from "@/app/actions/ai";
import { useAppStore } from "@/stores/app-store";
import { COMPANION_PERSONAS, QUICK_CHIPS, STUDENT_CHIPS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUserId } from "@/hooks/use-user-id";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  isCrisis?: boolean;
}

export default function CompanionPage() {
  const aiPersona = useAppStore((s) => s.aiPersona);
  const setAiPersona = useAppStore((s) => s.setAiPersona);
  const studentMode = useAppStore((s) => s.studentMode);
  const userId = useUserId();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const activePersona = COMPANION_PERSONAS.find(p => p.id === aiPersona) || COMPANION_PERSONAS[0];
  const chipsToUse = studentMode ? [...QUICK_CHIPS.slice(0,4), ...STUDENT_CHIPS] : QUICK_CHIPS;

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Call server action
    const response = await chatWithCompanion(text, aiPersona as any, studentMode, userId || undefined);
    
    setIsTyping(false);

    // Add AI message
    if (response.success && response.data) {
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          role: "ai", 
          content: response.data as string,
          isCrisis: response.isCrisis 
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          role: "ai", 
          content: response.error || "I'm having trouble connecting right now. Can we try again?"
        }
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] sm:h-[calc(100vh-100px)] flex flex-col">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-1 flex items-center gap-2">
            <MessageCircle className="text-teal" size={24} />
            Companion
          </h1>
          <p className="text-sm text-text-muted">A safe space to untangle your thoughts.</p>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-3">
          <select
            value={aiPersona}
            onChange={(e) => setAiPersona(e.target.value)}
            className="bg-card-soft border border-glass-border text-sm text-text-primary rounded-xl px-3 py-2 focus:outline-none focus:border-teal-muted"
          >
            {COMPANION_PERSONAS.map(p => (
              <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
            ))}
          </select>
          {studentMode && (
            <div className="px-3 py-1.5 rounded-lg bg-teal/10 border border-teal/20 text-teal text-xs font-medium flex items-center gap-1.5">
              <Sparkles size={12} />
              Student Mode
            </div>
          )}
        </div>
      </div>

      {/* ── Chat Window ── */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col min-h-0 border-t border-glass-border">
        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-8 mt-10">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-full bg-card-soft border border-glass-border flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(143,214,200,0.1)]"
              >
                {activePersona.emoji}
              </motion.div>
              <div>
                <h2 className="text-xl font-display text-text-primary font-medium mb-2">
                  I'm here to listen.
                </h2>
                <p className="text-text-muted text-sm leading-relaxed">
                  You don't have to be articulate. You don't have to be positive. Just type whatever is on your mind.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {chipsToUse.slice(0, 6).map((chip, i) => (
                  <motion.button
                    key={chip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleSend(chip)}
                    className="px-4 py-2 rounded-full border border-glass-border text-xs text-text-secondary hover:text-teal hover:border-teal/30 bg-bg-deep transition-all"
                  >
                    {chip}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm sm:text-base leading-relaxed relative",
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-teal to-teal-strong text-bg-deep rounded-tr-sm font-medium shadow-[0_4px_20px_rgba(143,214,200,0.25)] border border-teal-strong/50" 
                        : msg.isCrisis
                          ? "bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 text-red-50 rounded-tl-sm shadow-lg"
                          : "bg-gradient-to-br from-card-soft to-card-mid border border-glass-border text-text-primary rounded-tl-sm shadow-lg"
                    )}
                  >
                    {msg.isCrisis && (
                      <div className="flex items-center gap-2 mb-2 text-red-400 font-medium text-xs uppercase tracking-wider">
                        <AlertCircle size={14} /> Emergency Protocol
                      </div>
                    )}
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </>
          )}

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-start"
            >
              <div className="bg-gradient-to-br from-card-soft to-card-mid border border-glass-border rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5 shadow-lg h-12">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-bg-deep border-t border-glass-border shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-end gap-2"
          >
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Type a message..."
                className="w-full bg-card-soft border border-glass-border rounded-2xl py-3.5 pl-4 pr-12 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-teal-muted resize-none max-h-32 min-h-[52px]"
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 bottom-2 p-2 rounded-xl text-bg-deep bg-teal hover:bg-teal-strong transition-colors disabled:opacity-50 disabled:bg-card-soft disabled:text-text-muted flex items-center justify-center"
              >
                <Send size={16} className={input.trim() && !isTyping ? "ml-0.5" : ""} />
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
            <span className="text-[0.625rem] text-text-muted/50">
              MindBridge AI can make mistakes. In an emergency, go to the SOS tab.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
