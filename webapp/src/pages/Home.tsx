import { useState } from "react";
import WorkoutList from "../components/WorkoutList/WorkoutList";
import { WorkoutProps } from "../types";
import WorkoutForm from "../components/WorkoutForm/WorkoutForm";

export default function Home({ workoutList }: WorkoutProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [addNewWorkout, setAddNewWorkout] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    //   onSearch(term);
  };

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
      {addNewWorkout && <WorkoutForm newWorkout={addNewWorkout} />}
      <div>
        <WorkoutList workoutList={workoutList} />
      </div>
    </div>
  );
}
