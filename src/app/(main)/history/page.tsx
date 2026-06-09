"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessions } from "@/lib/storage";
import type { WorkoutSession } from "@/types";

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 24 }}>
        {/* Header */}
        <div style={{ padding: "20px 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => router.push("/planner")}
              style={{
                background: "none",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
                color: "var(--text-1)",
                lineHeight: 1,
              }}
            >
              ←
            </button>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-1)" }}>
                Gym History
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                Your past workout sessions
              </div>
            </div>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-3)",
              fontSize: 14,
              padding: "60px 24px",
            }}
          >
            No sessions yet. Start your first workout!
          </div>
        ) : (
          <div
            style={{
              padding: "0 16px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {sessions.map((session) => (
              <div
                key={session.id}
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background:
                      session.status === "completed" ? "var(--green-light)" : "#FFF0F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {session.status === "completed" ? "🏆" : "⚠️"}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 2 }}>
                    {formatDate(session.date)}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-1)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {session.planName} · {session.exercises.length} exercises ·{" "}
                    {session.completedSets} sets
                  </div>
                </div>

                {/* Duration */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--green)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {formatTime(session.duration)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
