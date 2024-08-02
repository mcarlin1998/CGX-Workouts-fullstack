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
  workouts: Workout[];
  setWorkouts: Dispatch<SetStateAction<Workout[]>>;
}

export default function WorkoutForm({
  newWorkout,
  setAddNewWorkout,
  showEditWorkoutForm,
  setShowEditWorkoutForm,
  workouts,
  setWorkouts,
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

          if (showEditWorkoutForm) {
            // Update the existing workout in the workouts state
            setWorkouts((prevWorkouts) =>
              prevWorkouts.map((workout) =>
                workout._id === data._id ? data : workout
              )
            );
          }

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
  }

  function formValidation() {
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
  }
  async function handleDeleteWorkout() {
    if (!showEditWorkoutForm?._id) {
      console.error("No workout selected for deletion.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/workouts/${showEditWorkoutForm._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        console.log("Workout deleted successfully");
        setWorkouts((prevWorkouts) =>
          prevWorkouts.filter(
            (workout) => workout._id !== showEditWorkoutForm._id
          )
        );
        setShowEditWorkoutForm(null);
      } else {
        const errorData = await response.json();
        setErrorMessages(["Failed to delete workout. Please try again later."]);
      }
    } catch (error) {
      setErrorMessages(["Network error. Please try again later."]);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          type="button"
          onClick={() => setShowEditWorkoutForm(null)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold mb-4">
          {newWorkout ? "Create a New Workout" : "Edit Workout"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="equipment_needed"
              className="block text-sm font-medium text-gray-700"
            >
              Equipment Needed:
            </label>
            <select
              id="equipment_needed"
              name="equipment_needed"
              value={formData.equipment_needed}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select equipment</option>
              {equipmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="image_url"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL:
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="video_url"
              className="block text-sm font-medium text-gray-700"
            >
              Video URL:
            </label>
            <input
              type="url"
              id="video_url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          {errorMessages.length > 0 && (
            <div className="mb-4 text-red-600">
              {errorMessages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading
              ? "Submitting..."
              : newWorkout
              ? "Submit Workout"
              : "Edit Workout"}
          </button>
          {showEditWorkoutForm && (
            <button
              type="button"
              onClick={handleDeleteWorkout}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-2"
            >
              {isLoading ? "Deleting..." : "Delete Workout"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
