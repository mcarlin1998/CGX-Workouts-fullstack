import { useEffect, useState } from "react";
import WorkoutList from "../components/WorkoutList/WorkoutList";
import { Workout } from "../types";
import WorkoutForm from "../components/WorkoutForm/WorkoutForm";

const PAGE_LIMIT = 5;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addNewWorkout, setAddNewWorkout] = useState<boolean>(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showEditWorkoutForm, setShowEditWorkoutForm] =
    useState<Workout | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    //   onSearch(term);
  };

  async function getWorkoutData(page: number) {
    try {
      const res = await fetch(
        `http://localhost:3000/workouts?page=${page}&limit=${PAGE_LIMIT}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const workoutData: Workout[] = await res.json();
      setWorkouts((prevWorkouts) => [...prevWorkouts, ...workoutData]);
      setHasMore(workoutData.length > 0);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch products. Please try again later.");
    }
  }

  useEffect(() => {
    getWorkoutData(page);
  }, [addNewWorkout, showEditWorkoutForm, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(workouts.length / PAGE_LIMIT)) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search workouts..."
        />
      </div>
      <div>
        <button onClick={() => setAddNewWorkout(!addNewWorkout)}>
          {addNewWorkout ? "Cancel" : "Add a new workout"}
        </button>
      </div>
      {(addNewWorkout || showEditWorkoutForm) && (
        <WorkoutForm
          newWorkout={addNewWorkout}
          setAddNewWorkout={setAddNewWorkout}
          showEditWorkoutForm={showEditWorkoutForm}
          setShowEditWorkoutForm={setShowEditWorkoutForm}
        />
      )}
      <div>
        <WorkoutList
          workoutList={workouts}
          setShowEditWorkoutForm={setShowEditWorkoutForm}
        />
      </div>
      <div>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={!hasMore}>
          Next
        </button>
      </div>
    </div>
  );
}
