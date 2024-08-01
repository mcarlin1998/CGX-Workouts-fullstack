import React from "react";
import WorkoutListItem from "../WorkoutListItem/WorkoutListItem";
import { Workout } from "../../types";

export interface WorkoutListProps {
  workoutList: Workout[];
  setShowEditWorkoutForm: (workout: Workout | null) => void;
}

export default function WorkoutList({
  workoutList,
  setShowEditWorkoutForm,
}: WorkoutListProps) {
  return (
    <div>
      {workoutList.length > 0 ? (
        workoutList.map((workout) => (
          <div
            onClick={() => setShowEditWorkoutForm(workout)}
            key={workout._id}
          >
            <WorkoutListItem {...workout} />
          </div>
        ))
      ) : (
        <p>No Workouts Created</p>
      )}
    </div>
  );
}
