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
  }, [page, addNewWorkout]);

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
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search workouts..."
            className="border rounded-md p-2 w-full md:w-1/2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>
      <div className="mb-4">
        <button
          onClick={() => setAddNewWorkout(!addNewWorkout)}
          className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
        >
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
      <div className="mt-4">
        <WorkoutList
          workoutList={workouts}
          setShowEditWorkoutForm={setShowEditWorkoutForm}
        />
      </div>
      <div className="mt-4 flex justify-center">
        {/* Uncomment and style pagination if needed */}
        {/* <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-gray-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-gray-600"
        >
          Previous
        </button>
        <span className="self-center">Page {page}</span> */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasMore}
          className={`bg-blue-500 text-white rounded-md px-4 py-2 ${
            !hasMore ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          Load More
        </button>
      </div>
    </div>
  );
}
