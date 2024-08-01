const Workout = require("../models/workout");

exports.createWorkout = async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();
    console.log(workouts);
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (workout) {
      res.json(workout);
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (workout) {
      res.json(workout);
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (workout) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
