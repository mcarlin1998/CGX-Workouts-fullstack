import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import { Workouts } from "./types";

function App() {
  const [workouts, setWorkouts] = useState<Workouts[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function getWorkoutData() {
    try {
      const res = await fetch("http://localhost:3000/workouts");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const workoutData: Workouts[] = await res.json();
      setWorkouts(workoutData);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch products. Please try again later.");
    }
  }

  useEffect(() => {
    getWorkoutData();
  }, []);

  console.log(workouts);
  return (
    <div className="App">
      <Home workoutList={workouts} />
    </div>
  );
}

export default App;
