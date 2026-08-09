"use client";

import { useEffect, useState } from "react";

interface VoteButtonProps {
  productId: string;
  initialCount: number;
}

function getVoterId(): string {
  const existing = localStorage.getItem("voterId");
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem("voterId", id);
  return id;
}

function getVotedIds(): Set<string> {
  try {
    const raw = localStorage.getItem("votedProductIds");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveVotedIds(ids: Set<string>) {
  localStorage.setItem("votedProductIds", JSON.stringify([...ids]));
}

export function VoteButton({ productId, initialCount }: VoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setVoted(getVotedIds().has(productId));
  }, [productId]);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  async function handleVote() {
    if (voted || submitting) return;
    setSubmitting(true);
    // optimistic update
    setVoted(true);
    setCount((c) => c + 1);
    const votedIds = getVotedIds();
    votedIds.add(productId);
    saveVotedIds(votedIds);

    try {
      const voterId = getVoterId();
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, voterId }),
      });
      const data = await res.json();
      if (typeof data.count === "number") setCount(data.count);
    } catch {
      // keep optimistic state — not worth reverting for a low-stakes vote
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleVote}
      disabled={voted || submitting}
      title={voted ? "You've voted for this one" : "Vote for more animations on this character"}
      className={`w-full mb-2 py-2 rounded-lg text-sm font-semibold transition-all border ${
        voted
          ? "bg-orange-500/20 border-orange-500/40 text-orange-300 cursor-default"
          : "bg-black/30 border-orange-500/30 text-orange-300 hover:bg-orange-500/10 hover:border-orange-500"
      }`}
    >
      🔥 {count} {voted ? "— Voted" : "— Vote for more animations"}
    </button>
  );
}
