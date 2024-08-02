import React, { useEffect, useState } from "react";
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
  const [sortOrder, setSortOrder] = useState<"Ascending" | "Descending">(
    "Ascending"
  );
  const [sortedWorkoutList, setSortedWorkoutList] = useState<Workout[]>([]);

  useEffect(() => {
    // Create a copy of the workout list
    const sortedList = [...workoutList];

    // Sort the copied list based on the sort order
    sortedList.sort((a, b) => {
      if (sortOrder === "Ascending") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    // Update the state with the sorted list
    setSortedWorkoutList(sortedList);
  }, [workoutList, sortOrder]);

  return (
    <div>
      <div>
        <label htmlFor="sortOrder">Sort by Title: </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "Ascending" | "Descending")
          }
        >
          <option value="Ascending">Ascending</option>
          <option value="Descending">Descending</option>
        </select>
      </div>
      {sortedWorkoutList.length > 0 ? (
        sortedWorkoutList.map((workout) => (
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
