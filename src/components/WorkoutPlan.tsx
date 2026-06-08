import type { Exercise, WorkoutPlan as WorkoutPlanType } from "@/types";
import { SortableExerciseCard } from "@/components/SortableExerciseCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

type WorkoutPlanProps = {
  plan: WorkoutPlanType;
  onEditExercise?: (exercise: Exercise) => void;
  onReorder: (exercises: Exercise[]) => void;
};

export default function WorkoutPlan({ plan, onEditExercise, onReorder }: WorkoutPlanProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = plan.exercises.findIndex((e) => e.id === active.id);
    const newIndex = plan.exercises.findIndex((e) => e.id === over.id);
    onReorder(arrayMove(plan.exercises, oldIndex, newIndex));
  }

  if (!plan.exercises.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-[18px] border border-border bg-surface p-6 text-center text-[14px] font-medium text-text-3">
        Speak your first exercise
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={plan.exercises.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {plan.exercises.map((exercise, index) => (
            <SortableExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index + 1}
              onEdit={onEditExercise ? () => onEditExercise(exercise) : undefined}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
