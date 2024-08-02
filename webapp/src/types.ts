// types.ts
export interface Workout {
  _id: string; // Use 'string' instead of 'String'
  title: string; // Use 'string' instead of 'String'
  description: string; // Use 'string' instead of 'String'
  image_url: string; // Use 'string' instead of 'String'
  video_url: string; // Use 'string' instead of 'String'
  equipment_needed: string; // Use 'string' instead of 'String'
}

export interface workoutPaginationProps {
  limit: number;
  page: number;
  total: number;
}

export interface getWorkoutDataProps {
  limit: number;
  page: number;
  total: number;
  workouts: Workout[];
}

export type GetWorkoutDataFunction = (
  searchTerm: string,
  page: number
) => Promise<void>;
