import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Exercise, WorkoutPlan } from "@/types"

const defaultPlan: WorkoutPlan = {
  id: "plan-default",
  name: "My Workout",
  createdAt: new Date().toISOString(),
  exercises: [],
}

type WorkoutStore = {
  plan: WorkoutPlan
  addExercise: (exercise: Exercise) => void
  updateExercise: (exercise: Exercise) => void
  deleteExercise: (id: string) => void
  clearPlan: () => void
  hydrate: () => void
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      plan: defaultPlan,
      addExercise: (exercise: Exercise) => {
        set((state) => ({
          plan: {
            ...state.plan,
            exercises: [...state.plan.exercises, exercise],
          },
        }))
      },
      updateExercise: (exercise: Exercise) => {
        set((state) => ({
          plan: {
            ...state.plan,
            exercises: state.plan.exercises.map((ex) =>
              ex.id === exercise.id ? exercise : ex
            ),
          },
        }))
      },
      deleteExercise: (id: string) => {
        set((state) => ({
          plan: {
            ...state.plan,
            exercises: state.plan.exercises.filter((ex) => ex.id !== id),
          },
        }))
      },
      clearPlan: () => {
        set({ plan: defaultPlan })
      },
      hydrate: () => {
        useWorkoutStore.persist.rehydrate()
      },
    }),
    {
      name: "voicegym-plan",
      skipHydration: true,
    }
  )
)
