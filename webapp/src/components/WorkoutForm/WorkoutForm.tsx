import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Workout } from "../../types";

export interface WorkoutFormStateProps {
  title: string;
  description: string;
  equipment_needed: string;
  image_url: string;
  video_url: string;
}

export interface WorkoutFormProps {
  newWorkout: boolean;
  setAddNewWorkout: Dispatch<SetStateAction<boolean>>;
  showEditWorkoutForm: Workout | null;
  setShowEditWorkoutForm: (workout: Workout | null) => void;
}

export default function WorkoutForm({
  newWorkout,
  setAddNewWorkout,
  showEditWorkoutForm,
  setShowEditWorkoutForm,
}: WorkoutFormProps) {
  const [formData, setFormData] = useState<WorkoutFormStateProps>({
    title: "",
    description: "",
    equipment_needed: "",
    image_url: "",
    video_url: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const equipmentOptions = ["none", "dumbbells", "barbell", "ball"];

  useEffect(() => {
    if (showEditWorkoutForm) {
      setFormData({
        title: showEditWorkoutForm.title,
        description: showEditWorkoutForm.description,
        equipment_needed: showEditWorkoutForm.equipment_needed,
        image_url: showEditWorkoutForm.image_url,
        video_url: showEditWorkoutForm.video_url,
      });
    }
  }, [showEditWorkoutForm]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formValidation()) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/workouts${
            newWorkout ? "" : `/${showEditWorkoutForm?._id}`
          }`,
          {
            method: newWorkout ? "POST" : "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(
            newWorkout ? "Workout created:" : "Workout edited:",
            data
          );
          setFormData({
            title: "",
            description: "",
            equipment_needed: "",
            image_url: "",
            video_url: "",
          });
          setAddNewWorkout(false);
          setShowEditWorkoutForm(null);
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData);
          setErrorMessages([errorData.message]);
        }
      } catch (error) {
        console.error("Network error:", error);
        setErrorMessages(["Network error. Please try again later."]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formValidation = () => {
    const errors: string[] = [];

    if (!formData.title) errors.push("Title is required");
    else if (formData.title.length < 5 || formData.title.length > 50)
      errors.push("Title must be between 5 and 50 characters");

    if (!formData.description) errors.push("Description is required");
    else if (formData.description.length > 500)
      errors.push("Description cannot exceed 500 characters");

    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    if (!formData.image_url || !urlRegex.test(formData.image_url))
      errors.push("Image URL is required and must be a valid URL");

    if (!formData.video_url || !urlRegex.test(formData.video_url))
      errors.push("Video URL is required and must be a valid URL");

    if (!formData.equipment_needed) errors.push("Equipment needed is required");
    else {
      const options = formData.equipment_needed
        .split(",")
        .map((option) => option.trim());
      if (!options.every((option) => equipmentOptions.includes(option)))
        errors.push("Equipment needed contains invalid options");
    }

    setErrorMessages(errors);
    return errors.length === 0;
  };

  return (
    <div>
      <h1>{newWorkout ? "Create a New Workout" : "Edit Workout"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="equipment_needed">Equipment Needed:</label>
          <select
            id="equipment_needed"
            name="equipment_needed"
            value={formData.equipment_needed}
            onChange={handleChange}
            required
          >
            <option value="">Select equipment</option>
            {equipmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image_url">Image URL:</label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="video_url">Video URL:</label>
          <input
            type="url"
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessages.length > 0 && (
          <div className="error-messages">
            {errorMessages.map((msg, index) => (
              <p key={index} className="error">
                {msg}
              </p>
            ))}
          </div>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Workout"}
        </button>
      </form>
    </div>
  );
}
