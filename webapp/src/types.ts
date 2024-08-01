export interface Workouts {
  title: String;
  description: String;
  image_url: String;
  video_url: String;
  equipment_needed: String;
}
export interface WorkoutProps {
  workoutList: Workouts[];
}
