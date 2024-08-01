import { useEffect, useState } from "react";
import WorkoutList from "../components/WorkoutList/WorkoutList";
import { Workout } from "../types";
import WorkoutForm from "../components/WorkoutForm/WorkoutForm";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addNewWorkout, setAddNewWorkout] = useState<boolean>(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showEditWorkoutForm, setShowEditWorkoutForm] =
    useState<Workout | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    //   onSearch(term);
  };

  async function getWorkoutData() {
    try {
      const res = await fetch("http://localhost:3000/workouts");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const workoutData: Workout[] = await res.json();
      setWorkouts(workoutData);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch products. Please try again later.");
    }
  }

  useEffect(() => {
    getWorkoutData();
  }, [addNewWorkout, showEditWorkoutForm]);

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search workouts..."
          // style={styles.input}
        />
      </div>
      <div>
        <button onClick={() => setAddNewWorkout(!addNewWorkout)}>
          Add a new workout
        </button>
      </div>
      {addNewWorkout ? (
        <WorkoutForm
          newWorkout={addNewWorkout}
          setAddNewWorkout={setAddNewWorkout}
          showEditWorkoutForm={null}
          setShowEditWorkoutForm={setShowEditWorkoutForm}
        />
      ) : showEditWorkoutForm ? (
        <WorkoutForm
          newWorkout={false}
          setAddNewWorkout={setAddNewWorkout}
          showEditWorkoutForm={showEditWorkoutForm}
          setShowEditWorkoutForm={setShowEditWorkoutForm}
        />
      ) : null}
      <div>
        <WorkoutList
          workoutList={workouts}
          setShowEditWorkoutForm={setShowEditWorkoutForm}
        />
      </div>
    </div>
  );
}
