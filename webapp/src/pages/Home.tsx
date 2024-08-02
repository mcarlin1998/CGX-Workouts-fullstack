import { useEffect, useState } from "react";
import WorkoutList from "../components/WorkoutList/WorkoutList";
import { Workout } from "../types";
import WorkoutForm from "../components/WorkoutForm/WorkoutForm";

const PAGE_LIMIT = 5;

interface getWorkoutDataProps {
  limit: number;
  page: number;
  total: number;
  workouts: Workout[];
}

interface workoutPaginationProps {
  limit: number;
  page: number;
  total: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addNewWorkout, setAddNewWorkout] = useState<boolean>(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showEditWorkoutForm, setShowEditWorkoutForm] =
    useState<Workout | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [workoutPaginationData, setWorkoutPaginationData] =
    useState<workoutPaginationProps | null>(null);

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
      const workoutData: getWorkoutDataProps = await res.json();
      console.log(workoutData);
      if (page > 1) {
        setWorkouts((prevWorkouts) => [
          ...prevWorkouts,
          ...workoutData.workouts,
        ]);
      } else {
        setWorkouts(workoutData.workouts);
      }
      setWorkoutPaginationData({
        limit: workoutData.limit,
        page: workoutData.page,
        total: workoutData.total,
      });

      setHasMore(workoutData.total > 0);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch products. Please try again later.");
    }
  }

  useEffect(() => {
    getWorkoutData(page);
  }, [addNewWorkout, showEditWorkoutForm, page]);

  function handlePageChange(newPage: number) {
    console.log(newPage);
    if (
      workoutPaginationData &&
      newPage > 0 &&
      newPage <= Math.ceil(workoutPaginationData.total / PAGE_LIMIT)
    ) {
      setPage(newPage);
    }
  }

  console.log(hasMore);

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
