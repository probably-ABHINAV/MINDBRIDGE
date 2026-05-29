"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Plus, Quote, Phone, Brain, X, Trash2 } from "lucide-react";
import { useCalmKit } from "@/hooks/use-database";
import { addCalmKitAction, deleteCalmKitAction } from "@/app/actions/db";
import { useUserId } from "@/hooks/use-user-id";
import { cn } from "@/lib/utils";

type KitType = "contact" | "quote" | "strategy";

export default function CalmKitPage() {
  const userId = useUserId();
  const { data: items, mutate } = useCalmKit();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newItemType, setNewItemType] = useState<KitType>("strategy");
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");

  const contacts = items.filter(i => i.type === "contact");
  const quotes = items.filter(i => i.type === "quote");
  const strategies = items.filter(i => i.type === "strategy");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newValue.trim()) return;

    if (userId) {
      await addCalmKitAction(
        userId,
        newItemType,
        newName.trim(),
        newValue.trim(),
        items.length
      );
      mutate();
    }

    setIsAdding(false);
    setNewName("");
    setNewValue("");
  };

  const handleDelete = async (id: number) => {
    if (userId) {
      await deleteCalmKitAction(userId, id);
      mutate();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-1.5 flex items-center gap-3">
            <Package className="text-teal" size={28} />
            Calm Kit
          </h1>
          <p className="text-text-muted text-base">Your personalized box of grounding tools.</p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card-soft border border-glass-border hover:border-teal/30 text-text-primary transition-all shrink-0"
          >
            <Plus size={18} />
            Add Item
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-text-primary">Add to your Calm Kit</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1.5 rounded-lg hover:bg-card-soft text-text-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-6">
                {(["strategy", "quote", "contact"] as KitType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewItemType(type)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2",
                      newItemType === type
                        ? "bg-teal/20 text-teal border border-teal/30"
                        : "bg-card-soft text-text-secondary border border-glass-border hover:bg-card-soft/80"
                    )}
                  >
                    {type === "strategy" && <Brain size={18} />}
                    {type === "quote" && <Quote size={18} />}
                    {type === "contact" && <Phone size={18} />}
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  {newItemType === "contact" ? "Name" : newItemType === "quote" ? "Author (optional)" : "Title"}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={
                    newItemType === "contact" ? "Mom" : 
                    newItemType === "quote" ? "Rumi" : "5-4-3-2-1 Grounding"
                  }
                  className="w-full bg-bg-deep border border-glass-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-teal-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  {newItemType === "contact" ? "Phone Number" : newItemType === "quote" ? "The Quote" : "Description"}
                </label>
                <textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="..."
                  rows={3}
                  className="w-full bg-bg-deep border border-glass-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-teal-muted resize-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={!newName.trim() || !newValue.trim()}
                  className="px-6 py-2.5 rounded-xl bg-teal text-bg-deep font-semibold disabled:opacity-50 transition-colors"
                >
                  Save Item
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Strategies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={18} className="text-teal" />
            <h2 className="font-semibold text-text-primary">Personal Strategies</h2>
          </div>
          {strategies.length === 0 ? (
            <div className="p-4 rounded-xl border border-glass-border border-dashed text-sm text-text-muted text-center">
              No strategies added yet.
            </div>
          ) : (
            strategies.map(item => (
              <div key={item.id} className="glass-card p-4 group relative">
                <button onClick={() => handleDelete(item.id!)} className="absolute top-2 right-2 p-1.5 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-card-soft">
                  <Trash2 size={14} />
                </button>
                <h3 className="font-medium text-text-primary mb-1 pr-6">{item.name}</h3>
                <p className="text-sm text-text-secondary whitespace-pre-wrap">{item.value}</p>
              </div>
            ))
          )}
        </div>

        {/* Quotes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Quote size={18} className="text-gold" />
            <h2 className="font-semibold text-text-primary">Safe Words</h2>
          </div>
          {quotes.length === 0 ? (
            <div className="p-4 rounded-xl border border-glass-border border-dashed text-sm text-text-muted text-center">
              No quotes added yet.
            </div>
          ) : (
            quotes.map(item => (
              <div key={item.id} className="glass-card p-4 group relative border-l-4 border-l-gold">
                <button onClick={() => handleDelete(item.id!)} className="absolute top-2 right-2 p-1.5 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-card-soft">
                  <Trash2 size={14} />
                </button>
                <p className="text-sm text-text-primary italic mb-2 pr-6">"{item.value}"</p>
                <h3 className="text-xs font-medium text-text-muted">— {item.name}</h3>
              </div>
            ))
          )}
        </div>

        {/* Contacts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Phone size={18} className="text-amber" />
            <h2 className="font-semibold text-text-primary">Safe People</h2>
          </div>
          {contacts.length === 0 ? (
            <div className="p-4 rounded-xl border border-glass-border border-dashed text-sm text-text-muted text-center">
              No contacts added yet.
            </div>
          ) : (
            contacts.map(item => (
              <div key={item.id} className="glass-card p-4 flex items-center justify-between group relative">
                <div>
                  <h3 className="font-medium text-text-primary mb-0.5">{item.name}</h3>
                  <p className="text-sm text-text-secondary">{item.value}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(item.id!)} className="p-2 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-card-soft">
                    <Trash2 size={14} />
                  </button>
                  <a href={`tel:${item.value}`} className="w-10 h-10 rounded-full bg-card-soft flex items-center justify-center text-amber hover:bg-amber-glow transition-colors">
                    <Phone size={16} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
