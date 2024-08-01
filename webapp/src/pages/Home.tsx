import { useState } from "react";
import WorkoutList from "../components/WorkoutList/WorkoutList";
import { WorkoutProps } from "../types";

export default function Home({ workoutList }: WorkoutProps) {
  const [searchTerm, setSearchTerm] = useState("");

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
        <button>Add a new workout</button>
      </div>
      <div>
        <WorkoutList workoutList={workoutList} />
      </div>
    </div>
  );
}
