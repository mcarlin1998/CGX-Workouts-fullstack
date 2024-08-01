import React from "react";
import { WorkoutProps } from "../../types";
import WorkoutListItem from "../WorkoutListItem/WorkoutListItem";

export default function WorkoutList({ workoutList }: WorkoutProps) {
  return (
    <div>
      {workoutList.length > 0
        ? workoutList.map((workout, index) => (
            <WorkoutListItem
              _id={workout._id}
              title={workout.title}
              description={workout.description}
              equipment_needed={workout.equipment_needed}
              image_url={workout.image_url}
              video_url={workout.video_url}
            />
          ))
        : "No Workouts Created"}
    </div>
  );
}
