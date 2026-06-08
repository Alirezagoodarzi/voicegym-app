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
