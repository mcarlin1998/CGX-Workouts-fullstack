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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.title || "";

    //If search is true then $regex operator to do matching and $options for case sensitivity. Potential issues as data becomes more complex and scaled.
    const searchTitleFilter = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    //Finally checks mongo workoutsDB based on the searchTitleFilter and then uses pagination to limit returns.

    const workouts = await Workout.find(searchTitleFilter)
      .skip((page - 1) * limit)
      .limit(limit);

    //Counts total workouts in db for pagination management and rendering purposes on the front-end.

    const totalWorkouts = await Workout.countDocuments(searchTitleFilter);
    res.json({ workouts, page, limit, total: totalWorkouts });
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
