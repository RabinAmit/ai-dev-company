const STORAGE_KEY = "workout-tracker-workouts";

const workoutForm = document.getElementById("workout-form");
const workoutList = document.getElementById("workout-list");
const emptyState = document.getElementById("empty-state");
const formMessage = document.getElementById("form-message");

let workouts = loadWorkouts();

renderWorkouts();

workoutForm.addEventListener("submit", function handleWorkoutSubmit(event) {
  event.preventDefault();

  const formData = new FormData(workoutForm);
  const workout = {
    id: String(Date.now()),
    date: formData.get("date").trim(),
    type: formData.get("type").trim(),
    duration: formData.get("duration").trim(),
    notes: formData.get("notes").trim()
  };

  // Keep validation beginner-friendly: at least one useful field must be filled in.
  if (!workout.date && !workout.type && !workout.duration && !workout.notes) {
    showMessage("Please fill in at least one field before saving.", "error");
    return;
  }

  workouts.unshift(workout);
  saveWorkouts();
  renderWorkouts();
  workoutForm.reset();
  showMessage("Workout saved successfully.", "success");
});

function loadWorkouts() {
  // localStorage keeps the data in the browser, so the list returns after refresh.
  const savedWorkouts = localStorage.getItem(STORAGE_KEY);

  if (!savedWorkouts) {
    return [];
  }

  try {
    const parsedWorkouts = JSON.parse(savedWorkouts);
    return Array.isArray(parsedWorkouts) ? parsedWorkouts : [];
  } catch (error) {
    console.error("Could not read workouts from storage.", error);
    return [];
  }
}

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function renderWorkouts() {
  workoutList.innerHTML = "";

  if (workouts.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  workouts.forEach(function renderWorkout(workout) {
    const listItem = document.createElement("li");
    listItem.className = "workout-item";

    const title = document.createElement("h3");
    title.textContent = workout.type || "Untitled Workout";

    const date = document.createElement("p");
    date.className = "workout-meta";
    date.textContent = "Date: " + (workout.date || "Not provided");

    const duration = document.createElement("p");
    duration.className = "workout-meta";
    duration.textContent = "Duration: " + (workout.duration ? workout.duration + " minutes" : "Not provided");

    const notes = document.createElement("p");
    notes.className = "workout-notes";
    notes.textContent = "Notes: " + (workout.notes || "None");

    listItem.append(title, date, duration, notes);
    workoutList.appendChild(listItem);
  });
}

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = "form-message " + type;
}