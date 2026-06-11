"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VoiceButton } from "@/components/VoiceButton";
import WorkoutPlan from "@/components/WorkoutPlan";
import ExerciseSheet from "@/components/ExerciseSheet";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import type { Exercise } from "@/types";

const HINTS = [
  "bench press on barbell, 4 sets, 8 reps, 90s rest",
  "squat on rack, 5 sets, 5 reps, 120s rest, 100 kg",
  "plank on mat, 3 sets, 1 rep, 60 seconds rest",
  "deadlift on barbell, 3 sets, 5 reps, 180s rest, 120 kg",
]

function TypingHint() {
  const [hintIndex, setHintIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = HINTS[hintIndex]

    if (!isDeleting && displayed.length < current.length) {
      const timeout = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length + 1))
      }, 40)
      return () => clearTimeout(timeout)
    }

    if (!isDeleting && displayed.length === current.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayed.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayed(displayed.slice(0, -1))
      }, 20)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setHintIndex((i) => (i + 1) % HINTS.length)
    }
  }, [displayed, isDeleting, hintIndex])

  return (
    <div style={{
      textAlign: 'center',
      padding: '0 24px',
      marginTop: '8px',
      minHeight: '20px',
    }}>
      <span style={{
        fontSize: '13px',
        color: '#9A9A9A',
        fontStyle: 'italic',
        lineHeight: '1',
      }}>
        Say: &quot;{displayed}
        <span style={{
          display: 'inline-block',
          width: '1px',
          height: '12px',
          background: '#2D6A4F',
          marginLeft: '1px',
          verticalAlign: 'middle',
          animation: 'blink 1s step-end infinite',
        }} />&quot;
      </span>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function PlannerPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const plan = useWorkoutStore((s) => s.plan);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const updateExercise = useWorkoutStore((s) => s.updateExercise);
  const deleteExercise = useWorkoutStore((s) => s.deleteExercise);
  const reorderExercises = useWorkoutStore((s) => s.reorderExercises);
  const hydrate = useWorkoutStore((s) => s.hydrate);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleTranscript = async (transcript: string) => {
    setError(null);
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    try {
      const res = await fetch(`${apiBase}/api/parse-exercise`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = (await res.json()) as { exercise?: Parameters<typeof addExercise>[0]; error?: string };
      if (!res.ok) {
        const msg = data.error ?? "Failed to parse exercise.";
        setError(msg);
        throw new Error(msg);
      }
      if (data.exercise) {
        addExercise(data.exercise);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setError(msg);
      throw err;
    }
  };

  return (
    <main style={{
      height: '100dvh', display: 'flex', flexDirection: 'column',
      maxWidth: '430px', margin: '0 auto', background: '#F5F7F2',
      paddingBottom: '0px',
    }}>
      <div className="flex flex-col px-4" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <header className="flex h-[60px] items-center justify-between py-4" style={{ flexShrink: 0 }}>
          <div>
            <h1 className="text-[26px] font-extrabold tracking-[-0.8px] text-text-1">
              Voice<span className="text-green">Gym</span>
            </h1>
            <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-text-3">
              workout planner
            </p>
          </div>
          <span className="rounded-full bg-green px-3 py-1 text-[10px] font-semibold uppercase text-white">
            FREE
          </span>
        </header>

        <section className="mb-4 rounded-[14px] border border-border bg-white px-4 py-4" style={{ flexShrink: 0 }}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[14px] font-semibold text-text-1">{plan.name}</p>
            <span
              className="rounded-[10px] text-[11px] font-semibold"
              style={{
                background: "#B7E4C7",
                color: "#2D6A4F",
                padding: "3px 8px",
              }}
            >
              {plan.exercises.length} exercises
            </span>
          </div>
          {mounted && (
            <p className="mt-1 text-[11px] text-[color:var(--text-3)]">
              {new Date(plan.createdAt).toLocaleDateString()}
            </p>
          )}
        </section>

        <section style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: '16px', paddingRight: '4px' }}>
          <WorkoutPlan
            plan={plan}
            onEditExercise={(exercise) => setEditingExercise(exercise)}
            onReorder={reorderExercises}
          />
        </section>

        <section style={{
          flexShrink: 0, background: '#fff',
          borderTop: '1.5px solid #E0E7D8',
          padding: '16px 20px 160px',
        }}>
          <button
            onClick={() => router.push("/session")}
            style={{
              display: "block",
              width: "100%",
              background: "var(--lime)",
              color: "var(--green)",
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            ▶ Start Session
          </button>
          <p className="mb-5 text-center text-[13px] font-medium text-text-2">
            Tap the mic and speak your next move.
          </p>
          {plan.exercises.length === 0 && <TypingHint />}
          <div className="flex justify-center">
            <VoiceButton onTranscript={handleTranscript} />
          </div>
          {error ? (
            <p className="mt-3 text-center text-[12px] text-red-500">{error}</p>
          ) : null}
        </section>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAddSheet(true)}
        style={{
          position: "fixed",
          bottom: "96px",
          right: "calc(50% - 215px + 16px)",
          width: "52px",
          height: "52px",
          borderRadius: "16px",
          background: "#2D6A4F",
          color: "#fff",
          fontSize: "24px",
          boxShadow: "0 4px 16px rgba(45,106,79,0.4)",
          zIndex: 40,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Add exercise"
      >
        +
      </button>

      {/* Edit sheet */}
      {editingExercise && (
        <ExerciseSheet
          mode="edit"
          exercise={editingExercise}
          onSave={(updated) => {
            updateExercise(updated);
            setEditingExercise(null);
          }}
          onDelete={() => {
            deleteExercise(editingExercise.id);
            setEditingExercise(null);
          }}
          onClose={() => setEditingExercise(null)}
        />
      )}

      {/* Add sheet */}
      {showAddSheet && (
        <ExerciseSheet
          mode="add"
          onSave={(exercise) => {
            addExercise(exercise);
            setShowAddSheet(false);
          }}
          onClose={() => setShowAddSheet(false)}
        />
      )}
    </main>
  );
}
