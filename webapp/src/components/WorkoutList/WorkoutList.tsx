import React, { useState } from "react";
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
      {workoutList.length > 0
        ? workoutList.map((workout, index) => (
            <div
              onClick={() =>
                setShowEditWorkoutForm({
                  _id: workout._id,
                  title: workout.title,
                  description: workout.description,
                  equipment_needed: workout.equipment_needed,
                  image_url: workout.image_url,
                  video_url: workout.video_url,
                })
              }
              key={index}
            >
              <WorkoutListItem
                _id={workout._id}
                title={workout.title}
                description={workout.description}
                equipment_needed={workout.equipment_needed}
                image_url={workout.image_url}
                video_url={workout.video_url}
              />
            </div>
          ))
        : "No Workouts Created"}
    </div>
  );
}
