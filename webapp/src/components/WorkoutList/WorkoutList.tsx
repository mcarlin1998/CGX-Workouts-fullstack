import { WorkoutProps } from "../../types";
import WorkoutListItem from "../WorkoutListItem/WorkoutListItem";

export default function WorkoutList({ workoutList }: WorkoutProps) {
  return (
    <div>
      {workoutList
        ? workoutList.map((workout, index) => {
            return (
              <WorkoutListItem
                title={workout.title}
                description={workout.description}
                equipment_needed={workout.equipment_needed}
                image_url={workout.image_url}
                video_url={workout.video_url}
                key={index}
              />
            );
          })
        : "No Workouts Created"}
    </div>
  );
}
