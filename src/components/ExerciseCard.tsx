import { Pencil } from "lucide-react";
import type { Exercise } from "@/types";

type ExerciseCardProps = {
  exercise: Exercise;
  index: number;
  onEdit?: () => void;
};

export default function ExerciseCard({ exercise, index, onEdit }: ExerciseCardProps) {
  const stats = [
    { label: "SETS", value: exercise.sets },
    { label: "REPS", value: exercise.reps },
    { label: "REST", value: exercise.restSeconds },
  ];

  return (
    <article className="flex items-start gap-4 rounded-[18px] border border-border bg-surface p-3.5 px-4">
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          borderRadius: "8px",
          background: "#2D6A4F",
          color: "#B7E4C7",
          fontSize: "11px",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {String(index).padStart(2, "0")}
      </div>

      <div className="flex-1">
        <h2 className="text-[14px] font-semibold text-text-1">{exercise.name}</h2>
        <p className="mt-1 text-[11px] uppercase tracking-[0.05em] text-text-3">
          {exercise.equipment}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 rounded-[8px] border border-border px-2 py-1"
              style={{ background: "#EEF2E8" }}
            >
              <span style={{ color: "#2D6A4F", fontWeight: 700 }} className="text-[11px]">
                {stat.value}
              </span>
              <span className="text-[11px] text-text-2">{stat.label}</span>
            </div>
          ))}
          <div
            className="flex items-center gap-2 rounded-[8px] border border-border px-2 py-1"
            style={{ background: "#EEF2E8" }}
          >
            <span style={{ color: "#2D6A4F", fontWeight: 700 }} className="text-[11px]">
              {exercise.weight ?? 0}
            </span>
            <span className="text-[11px] text-text-2">{exercise.weightUnit ?? "kg"}</span>
          </div>
        </div>
      </div>

      {onEdit && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "var(--text-3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
          aria-label="Edit exercise"
        >
          <Pencil size={14} />
        </button>
      )}
    </article>
  );
}
