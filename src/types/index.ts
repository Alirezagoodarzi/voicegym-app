export type Exercise = {
  id: string
  name: string
  equipment: string
  equipmentId: string
  sets: number
  reps: number
  restSeconds: number
  weight: number
  weightUnit: "kg" | "lbs"
}

export type WorkoutPlan = {
  id: string
  name: string
  createdAt: string
  exercises: Exercise[]
}

export type SetRecord = {
  setNumber: number
  done: boolean
}

export type SessionExercise = {
  exercise: Exercise
  sets: SetRecord[]
}

export type WorkoutSession = {
  id: string
  date: string
  duration: number
  status: 'completed' | 'incomplete'
  exercises: SessionExercise[]
  planName: string
  totalSets: number
  completedSets: number
}
