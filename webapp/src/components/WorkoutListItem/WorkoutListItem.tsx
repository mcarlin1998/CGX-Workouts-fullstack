import { Workout } from "../../types";

export default function WorkoutListItem({
  _id,
  title,
  description,
  equipment_needed,
  image_url,
  video_url,
}: Workout) {
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
