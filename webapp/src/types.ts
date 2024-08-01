// types.ts
export interface Workouts {
  _id: string; // Use 'string' instead of 'String'
  title: string; // Use 'string' instead of 'String'
  description: string; // Use 'string' instead of 'String'
  image_url: string; // Use 'string' instead of 'String'
  video_url: string; // Use 'string' instead of 'String'
  equipment_needed: string; // Use 'string' instead of 'String'
}

export interface WorkoutProps {
  workoutList: Workouts[];
}
