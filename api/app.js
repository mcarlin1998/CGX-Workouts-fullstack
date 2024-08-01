const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDatabase = require("./config/database");

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDatabase();

app.get("/", (req, res) => {
  res.send("Welcome to the Workouts API!");
});

const workoutController = require("./controllers/workoutController");
app.get("/workouts", workoutController.getWorkouts);

app.get("/workouts/:id", workoutController.getWorkoutById);
app.post("/workouts", workoutController.createWorkout);
app.put("/workouts/:id", workoutController.updateWorkoutById);
app.delete("/workouts/:id", workoutController.deleteWorkoutById);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
