"use client";

import { useState, useEffect } from "react";
import { Dumbbell, History, User } from "lucide-react";
import { VoiceButton } from "@/components/VoiceButton";
import WorkoutPlan from "@/components/WorkoutPlan";
import ExerciseSheet from "@/components/ExerciseSheet";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import type { Exercise } from "@/types";

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const plan = useWorkoutStore((s) => s.plan);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const updateExercise = useWorkoutStore((s) => s.updateExercise);
  const deleteExercise = useWorkoutStore((s) => s.deleteExercise);
  const hydrate = useWorkoutStore((s) => s.hydrate);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleTranscript = async (transcript: string) => {
    setError(null);
    try {
      const res = await fetch("/api/parse-exercise", {
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
    <main className="min-h-screen bg-bg text-text-1">
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col px-4 pb-4">
        <header className="flex h-[60px] items-center justify-between py-4">
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

        <section className="mb-4 rounded-[14px] border border-border bg-white px-4 py-4">
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

        <section className="flex-1 overflow-y-auto pr-1 pb-3">
          <WorkoutPlan
            plan={plan}
            onEditExercise={(exercise) => setEditingExercise(exercise)}
          />
        </section>

        <section className="border-t-[1.5px] border-[color:var(--border)] bg-white px-5 py-5">
          <p className="mb-5 text-center text-[13px] font-medium text-text-2">
            Tap the mic and speak your next move.
          </p>
          <div className="flex justify-center">
            <VoiceButton onTranscript={handleTranscript} />
          </div>
          {error ? (
            <p className="mt-3 text-center text-[12px] text-red-500">{error}</p>
          ) : null}
        </section>

        <nav className="mt-3 flex items-center justify-between rounded-t-[22px] border-t border-border bg-white px-6 py-3">
          <button
            className="flex flex-col items-center gap-1 text-[11px] font-semibold"
            style={{ color: "#2D6A4F" }}
          >
            <Dumbbell className="h-5 w-5" />
            Workout
          </button>
          <button
            className="flex flex-col items-center gap-1 text-[11px] font-semibold"
            style={{ color: "#9A9A9A" }}
          >
            <History className="h-5 w-5" />
            History
          </button>
          <button
            className="flex flex-col items-center gap-1 text-[11px] font-semibold"
            style={{ color: "#9A9A9A" }}
          >
            <User className="h-5 w-5" />
            Profile
          </button>
        </nav>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAddSheet(true)}
        style={{
          position: "fixed",
          bottom: "72px",
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
