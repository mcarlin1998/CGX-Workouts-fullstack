import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Workout, workoutPaginationProps } from "./types";

const PAGE_LIMIT = 5; //Can adjust as needed for rendering

interface getWorkoutDataProps {
  limit: number;
  page: number;
  total: number;
  workouts: Workout[];
}

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [workoutPaginationData, setWorkoutPaginationData] =
    useState<workoutPaginationProps | null>(null);

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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              getWorkoutData={getWorkoutData}
              PAGE_LIMIT={PAGE_LIMIT}
              page={page}
              setPage={setPage}
              hasMore={hasMore}
              workoutPaginationData={workoutPaginationData}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
