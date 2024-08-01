import React, { useState } from "react";
import { WorkoutFormStateProps, WorkoutFormProps } from "../../types";

export default function WorkoutForm({ newWorkout }: WorkoutFormProps) {
  // Initialize state for form inputs
  const [formData, setFormData] = useState<WorkoutFormStateProps>({
    title: "",
    description: "",
    equipment_needed: "",
    image_url: "",
    video_url: "",
  });

  // Initialize state for error messages
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const equipmentOptions = ["none", "dumbbells", "barbell", "ball"];

  // Handle input changes
  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Handle form submission
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Here you would usually send the formData to a server or handle it accordingly
    if (formValiation()) {
      if (newWorkout) {
        console.log(formData);
        try {
          const response = await fetch("http://localhost:3000/workouts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Workout created:", data);
            // Optionally clear the form
            setFormData({
              title: "",
              description: "",
              equipment_needed: "",
              image_url: "",
              video_url: "",
            });
          } else {
            const errorData = await response.json();
            console.error("Error:", errorData);
          }
        } catch (error) {
          console.error("Network error:", error);
        }
      }
    }
  }

  function formValiation() {
    const errors: string[] = [];

    if (!formData.title) errors.push("Title is required");
    else if (formData.title.length < 5 || formData.title.length > 50)
      errors.push("Title must be between 5 and 50 characters");

    if (!formData.description) errors.push("Description is required");
    else if (formData.description.length > 500)
      errors.push("Description cannot exceed 500 characters");

    if (
      !formData.image_url ||
      !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
        formData.image_url
      )
    )
      errors.push("Image URL is required and must be a valid URL");

    if (
      !formData.video_url ||
      !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
        formData.video_url
      )
    )
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
  }

  return (
    <div>
      <h1>Create a New Workout</h1>
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

        <button type="submit">Submit Workout</button>
      </form>
    </div>
  );
}
