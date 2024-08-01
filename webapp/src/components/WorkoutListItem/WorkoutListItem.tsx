import { Workouts } from "../../types";

export default function WorkoutListItem({
  title,
  description,
  equipment_needed,
  image_url,
  video_url,
}: Workouts) {
  return (
    <div>
      <h3>{image_url}</h3>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>{equipment_needed}</p>
      <p>{video_url}</p>
    </div>
  );
}
