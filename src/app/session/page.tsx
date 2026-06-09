"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { saveSession } from "@/lib/storage";
import type { SessionExercise, SetRecord } from "@/types";

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function SessionPage() {
  const router = useRouter();
  const plan = useWorkoutStore((s) => s.plan);
  const hydrate = useWorkoutStore((s) => s.hydrate);

  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>([]);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const exerciseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const savedRef = useRef(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (plan.exercises.length > 0) {
      setSessionExercises(
        plan.exercises.map((exercise) => ({
          exercise,
          sets: Array.from({ length: exercise.sets }, (_, i) => ({
            setNumber: i + 1,
            done: false,
          })) as SetRecord[],
        }))
      );
    }
  }, [plan]);

  useEffect(() => {
    if (!started || paused) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [started, paused]);

  const totalSets = sessionExercises.reduce((acc, se) => acc + se.sets.length, 0);
  const completedSets = sessionExercises.reduce(
    (acc, se) => acc + se.sets.filter((s) => s.done).length,
    0
  );
  const allDone = totalSets > 0 && completedSets === totalSets;
  const topWeight =
    plan.exercises.length > 0
      ? Math.max(...plan.exercises.map((e) => e.weight))
      : 0;
  const topWeightUnit =
    plan.exercises.length > 0
      ? plan.exercises.reduce((max, e) => (e.weight > max.weight ? e : max)).weightUnit
      : "kg";

  const doSaveSession = useCallback(
    (status: "completed" | "incomplete") => {
      if (savedRef.current) return;
      savedRef.current = true;
      saveSession({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        duration: elapsed,
        status,
        exercises: sessionExercises,
        planName: plan.name,
        totalSets,
        completedSets,
      });
    },
    [elapsed, sessionExercises, plan.name, totalSets, completedSets]
  );

  const markSet = (exIdx: number, setIdx: number) => {
    setSessionExercises((prev) => {
      const next = prev.map((se, ei) => {
        if (ei !== exIdx) return se;
        return {
          ...se,
          sets: se.sets.map((s, si) =>
            si === setIdx ? { ...s, done: true } : s
          ),
        };
      });

      const allExDone = next[exIdx].sets.every((s) => s.done);
      if (allExDone && exIdx < next.length - 1) {
        setTimeout(() => {
          exerciseRefs.current[exIdx + 1]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }

      const allComplete = next.every((se) => se.sets.every((s) => s.done));
      if (allComplete && !savedRef.current) {
        const doneCount = next.reduce(
          (acc, se) => acc + se.sets.filter((s) => s.done).length,
          0
        );
        setTimeout(() => {
          savedRef.current = true;
          saveSession({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            duration: elapsed,
            status: "completed",
            exercises: next,
            planName: plan.name,
            totalSets: next.reduce((acc, se) => acc + se.sets.length, 0),
            completedSets: doneCount,
          });
          setShowCongrats(true);
        }, 800);
      }

      return next;
    });
  };

  const handleEndSession = (status: "completed" | "incomplete") => {
    doSaveSession(status);
    router.push("/planner");
  };

  // ── PRE-START SCREEN ──────────────────────────────────────────────────────
  if (!started) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <div style={{ maxWidth: 430, margin: "0 auto", paddingBottom: 24 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 16px 8px",
            }}
          >
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
                {plan.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                {plan.exercises.length} exercises · {totalSets} total sets
              </div>
            </div>
          </div>

          {/* Summary card */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 16,
              margin: "12px 16px",
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {[
                { value: plan.exercises.length, label: "Exercises" },
                { value: totalSets, label: "Total Sets" },
                {
                  value: topWeight > 0 ? `${topWeight}${topWeightUnit}` : "—",
                  label: "Top Weight",
                },
              ].map(({ value, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "var(--green)",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "var(--text-3)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise preview */}
          <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {plan.exercises.map((ex, i) => (
              <div
                key={ex.id}
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
                <span
                  style={{
                    minWidth: 26,
                    height: 26,
                    borderRadius: 8,
                    background: "var(--green-light)",
                    color: "var(--green)",
                    fontSize: 12,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ flex: 1, fontWeight: 600, fontSize: 13, color: "var(--text-1)" }}>
                  {ex.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)", whiteSpace: "nowrap" }}>
                  {ex.sets}×{ex.reps} · {ex.weight}{ex.weightUnit}
                </div>
              </div>
            ))}
          </div>

          {/* Start button */}
          <button
            onClick={() => {
              setStarted(true);
              setStartTime(Date.now());
            }}
            style={{
              display: "block",
              width: "calc(100% - 32px)",
              margin: "16px 16px 0",
              background: "var(--green)",
              color: "white",
              border: "none",
              borderRadius: 16,
              padding: 16,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ▶ Start Session
          </button>
        </div>
      </main>
    );
  }

  // ── CONGRATS SCREEN ───────────────────────────────────────────────────────
  if (showCongrats) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 20px",
          maxWidth: 430,
          margin: "0 auto",
        }}
      >
        <div style={{ fontSize: 64 }}>🏆</div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "var(--text-1)",
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Workout
          <br />
          <span style={{ color: "var(--green)" }}>Complete!</span>
        </div>
        <div
          style={{
            fontSize: 14,
            color: "var(--text-2)",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Amazing work! You crushed every set.
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 24,
            width: "100%",
          }}
        >
          {[
            { value: formatTime(elapsed), label: "Duration" },
            { value: completedSets, label: "Sets Done" },
            { value: plan.exercises.length, label: "Exercises" },
          ].map(({ value, label }) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "12px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--green)" }}>
                {value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--text-3)",
                  letterSpacing: "0.06em",
                  marginTop: 2,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/planner")}
          style={{
            marginTop: 24,
            width: "100%",
            background: "var(--green)",
            color: "white",
            border: "none",
            borderRadius: 14,
            padding: 14,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Back to Planner →
        </button>
      </main>
    );
  }

  // ── ACTIVE SESSION SCREEN ─────────────────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Green header */}
        <div style={{ background: "var(--green)", padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => setPaused((p) => !p)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 8,
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button
              onClick={() => handleEndSession("incomplete")}
              style={{
                background: "none",
                border: "none",
                color: "#FFB3B3",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              End Session
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 36,
              fontWeight: 800,
              marginTop: 12,
              letterSpacing: "0.02em",
            }}
          >
            {formatTime(elapsed)}
          </div>
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              marginTop: 2,
            }}
          >
            Session Duration
          </div>

          {/* Progress bar */}
          <div
            style={{
              marginTop: 12,
              height: 4,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${totalSets > 0 ? (completedSets / totalSets) * 100 : 0}%`,
                background: "var(--lime)",
                borderRadius: 2,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div
            style={{
              textAlign: "right",
              color: "rgba(255,255,255,0.5)",
              fontSize: 11,
              marginTop: 4,
            }}
          >
            {completedSets} of {totalSets} sets done
          </div>
        </div>

        {/* Exercise list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {sessionExercises.map((se, exIdx) => {
            const doneSets = se.sets.filter((s) => s.done).length;
            const allExDone = doneSets === se.sets.length;
            const hasAnyDone = doneSets > 0;
            const firstUndoneIdx = se.sets.findIndex((s) => !s.done);

            return (
              <div
                key={se.exercise.id}
                ref={(el) => { exerciseRefs.current[exIdx] = el; }}
                style={{
                  background: "white",
                  border: `1px solid ${allExDone ? "var(--border)" : hasAnyDone ? "var(--green-mid)" : "var(--border)"}`,
                  borderRadius: 14,
                  padding: "12px 14px",
                  opacity: allExDone ? 0.55 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span
                    style={{
                      minWidth: 26,
                      height: 26,
                      borderRadius: 8,
                      background: allExDone ? "var(--green-light)" : "var(--surface-2)",
                      color: allExDone ? "var(--green)" : "var(--text-2)",
                      fontSize: 12,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {allExDone ? "✓" : exIdx + 1}
                  </span>
                  <div style={{ flex: 1, fontWeight: 700, fontSize: 13, color: "var(--text-1)" }}>
                    {se.exercise.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", whiteSpace: "nowrap" }}>
                    {se.exercise.sets}×{se.exercise.reps} · {se.exercise.weight}{se.exercise.weightUnit}
                  </div>
                </div>

                {/* Set chips */}
                <div style={{ display: "flex", gap: 6 }}>
                  {se.sets.map((setRecord, setIdx) => {
                    const isDone = setRecord.done;
                    const isNext = !isDone && setIdx === firstUndoneIdx;

                    return (
                      <button
                        key={setRecord.setNumber}
                        onClick={() => !isDone && markSet(exIdx, setIdx)}
                        style={{
                          height: 32,
                          flex: 1,
                          borderRadius: 8,
                          border: isDone
                            ? "none"
                            : isNext
                            ? "1.5px solid var(--lime)"
                            : "1px solid var(--border)",
                          background: isDone
                            ? "var(--green)"
                            : isNext
                            ? "white"
                            : "var(--surface-2)",
                          color: isDone
                            ? "white"
                            : isNext
                            ? "var(--text-1)"
                            : "var(--text-3)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: isDone ? "default" : "pointer",
                          boxShadow: isNext ? "0 0 8px rgba(170,255,0,0.5)" : "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isDone ? `✓${setRecord.setNumber}` : setRecord.setNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* End early button */}
          <button
            onClick={() => handleEndSession("incomplete")}
            style={{
              width: "100%",
              margin: "4px 0 16px",
              border: "1px solid #FFD0D0",
              background: "#FFF5F5",
              color: "#FF4D4D",
              borderRadius: 12,
              padding: 11,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ⚠ End Session Early
          </button>
        </div>
      </div>
    </main>
  );
}
