"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ExerciseCard from "@/components/ExerciseCard";
import type { Exercise } from "@/types";

type Props = {
  exercise: Exercise;
  index: number;
  onEdit?: () => void;
};

export function SortableExerciseCard({ exercise, index, onEdit }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ExerciseCard exercise={exercise} index={index} onEdit={onEdit} />
    </div>
  );
}
