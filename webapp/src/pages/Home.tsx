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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getWorkoutData(searchTerm: string, page: number) {
    setIsLoading(true);
    setError(null);

    try {
      // Construct the query parameters, omitting 'title' if searchTerm is empty
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_LIMIT.toString(),
      });

      if (searchTerm) {
        queryParams.append("title", searchTerm);
      }

      const response = await fetch(
        `http://localhost:3000/workouts?${queryParams}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        setError(errorData.message);
        return;
      }

      const workoutData: getWorkoutDataProps = await response.json();
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

      setHasMore(workoutData.total > workoutData.page * workoutData.limit);
    } catch (error) {
      console.error("Network error:", error);
      setError("Failed to fetch workouts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getWorkoutData("", page);
    //Removed addNewWorkout state check in dependency array to cut down on unnecessary api requests
  }, [page]);

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

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const term = event.target.value;
    setSearchTerm(term);
    //   onSearch(term);
  }

  async function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(searchTerm);
    getWorkoutData(searchTerm, 1);
  }

  console.log(workouts);
  return (
    <div>
      <div>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search workouts..."
          />
          <button type="submit">Search</button>
        </form>
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
          workouts={workouts}
          setWorkouts={setWorkouts}
        />
      )}
      <div>
        <WorkoutList
          workoutList={workouts}
          setShowEditWorkoutForm={setShowEditWorkoutForm}
        />
      </div>
      <div>
        {/* <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span> */}
        <button onClick={() => handlePageChange(page + 1)} disabled={!hasMore}>
          Load More
        </button>
      </div>
    </div>
  );
}
