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
