export type Exercise = {
  id: string
  name: string
  equipment: string
  equipmentId: string
  sets: number
  reps: number
  restSeconds: number
}

export type WorkoutPlan = {
  id: string
  name: string
  createdAt: string
  exercises: Exercise[]
}
