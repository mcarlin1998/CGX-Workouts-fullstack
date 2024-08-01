const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [5, "Title must be at least 5 characters long"],
    maxlength: [50, "Title cannot exceed 50 characters"],
    match: [/^[a-zA-Z0-9 ]+$/, "Title must be alphanumeric"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [500, "Description cannot exceed 500 characters"],
    match: [/^[a-zA-Z0-9 ]+$/, "Description must be alphanumeric"],
  },
  image_url: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  video_url: {
    type: String,
    required: [true, "Video URL is required"],
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  equipment_needed: {
    type: String,
    required: [true, "Equipment needed is required"],
    validate: {
      validator: (value) => {
        const equipmentOptions = ["none", "dumbbells", "barbell", "ball"];
        const options = value.split(",").map((option) => option.trim());
        return options.every((option) => equipmentOptions.includes(option));
      },
      message: (props) => `${props.value} is not a valid equipment option`,
    },
  },
});

module.exports = mongoose.model("Workout", workoutSchema);
