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
  const [sortOrder, setSortOrder] = useState<"Ascending" | "Descending" | "">(
    ""
  );
  const [sortedWorkoutList, setSortedWorkoutList] = useState<Workout[]>([]);

  useEffect(() => {
    // Create a copy of the workout list
    if (sortOrder) {
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
    } else {
      setSortedWorkoutList(workoutList);
    }
  }, [workoutList, sortOrder]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-baseline">
        <label htmlFor="sortOrder" className="block text-lg font-medium mb-2">
          Sort by Title:
        </label>
        <select
          id="sortOrder"
          defaultValue=""
          onChange={(e) =>
            setSortOrder(e.target.value as "Ascending" | "Descending" | "")
          }
          className="border rounded-md p-2 text-sm w-30"
        >
          <option value="">No Order</option>
          <option value="Ascending">Ascending</option>
          <option value="Descending">Descending</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sortedWorkoutList.length > 0 ? (
          sortedWorkoutList.map((workout) => (
            <div
              key={workout._id}
              className="cursor-pointer flex flex-col items-center"
              onClick={() => window.open(workout.video_url, "_blank")}
            >
              <WorkoutListItem {...workout} />
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from bubbling up to the div
                  setShowEditWorkoutForm(workout);
                }}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Workout
              </button>
            </div>
          ))
        ) : (
          <p>No Workouts Created</p>
        )}
      </div>
    </div>
  );
}
