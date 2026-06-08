import type { Exercise, WorkoutPlan as WorkoutPlanType } from "@/types";
import ExerciseCard from "@/components/ExerciseCard";

type WorkoutPlanProps = {
  plan: WorkoutPlanType;
  onEditExercise?: (exercise: Exercise) => void;
};

export default function WorkoutPlan({ plan, onEditExercise }: WorkoutPlanProps) {
  if (!plan.exercises.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-[18px] border border-border bg-surface p-6 text-center text-[14px] font-medium text-text-3">
        Speak your first exercise
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plan.exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={index + 1}
          onEdit={onEditExercise ? () => onEditExercise(exercise) : undefined}
        />
      ))}
    </div>
  );
}
