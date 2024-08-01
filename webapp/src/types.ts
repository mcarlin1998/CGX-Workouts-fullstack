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

export interface WorkoutFormStateProps {
  title: string;
  description: string;
  equipment_needed: string;
  image_url: string;
  video_url: string;
}

export interface WorkoutFormProps {
  newWorkout: boolean;
}
