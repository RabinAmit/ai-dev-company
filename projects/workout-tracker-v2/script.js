const STORAGE_KEY = "workout-tracker-v2-workouts";

const workoutForm = document.getElementById("workout-form");
const workoutIdInput = document.getElementById("workout-id");
const nameInput = document.getElementById("name");
const setsInput = document.getElementById("sets");
const repsInput = document.getElementById("reps");
const dateInput = document.getElementById("date");
const formTitle = document.getElementById("form-title");
const formMessage = document.getElementById("form-message");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");
const workoutList = document.getElementById("workout-list");
const emptyState = document.getElementById("empty-state");

let workouts = loadWorkouts();

renderWorkouts();

workoutForm.addEventListener("submit", handleSubmit);
cancelButton.addEventListener("click", resetForm);

function handleSubmit(event) {
  event.preventDefault();

  const workout = getFormValues();
  if (!workout) {
    return;
  }

  if (workoutIdInput.value) {
    workouts = workouts.map((entry) => {
      if (entry.id === workoutIdInput.value) {
        return { ...entry, ...workout };
      }

      return entry;
    });
    saveWorkouts();
    renderWorkouts();
    resetForm();
    setMessage("Workout updated.");
    return;
  }

  const workoutId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `workout-${Date.now()}`;

  workouts.unshift({
    id: workoutId,
    ...workout
  });

  saveWorkouts();
  renderWorkouts();
  resetForm();
  setMessage("Workout saved.");
}

function getFormValues() {
  const name = nameInput.value.trim();
  const sets = Number(setsInput.value);
  const reps = Number(repsInput.value);
  const date = dateInput.value;

  if (!name || !date || Number.isNaN(sets) || Number.isNaN(reps) || sets < 1 || reps < 1) {
    setMessage("Please complete all fields with valid values.");
    return null;
  }

  return {
    name,
    sets,
    reps,
    date
  };
}

function renderWorkouts() {
  workoutList.innerHTML = "";

  if (workouts.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  workouts.forEach((workout) => {
    const item = document.createElement("li");
    item.className = "workout-item";

    item.innerHTML = `
      <div class="workout-header">
        <div>
          <h3 class="workout-title">${escapeHtml(workout.name)}</h3>
          <p class="workout-meta">${formatDate(workout.date)}</p>
        </div>
        <div class="workout-actions">
          <button type="button" class="edit-button" data-id="${workout.id}">Edit</button>
          <button type="button" class="delete-button" data-id="${workout.id}">Delete</button>
        </div>
      </div>
      <div class="workout-stats">
        <span class="workout-stat">Sets: ${workout.sets}</span>
        <span class="workout-stat">Reps: ${workout.reps}</span>
      </div>
    `;

    workoutList.appendChild(item);
  });
}

workoutList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const workoutId = button.dataset.id;

  if (button.classList.contains("edit-button")) {
    startEditWorkout(workoutId);
    return;
  }

  if (button.classList.contains("delete-button")) {
    deleteWorkout(workoutId);
  }
});

function startEditWorkout(workoutId) {
  const workout = workouts.find((entry) => entry.id === workoutId);
  if (!workout) {
    return;
  }

  workoutIdInput.value = workout.id;
  nameInput.value = workout.name;
  setsInput.value = workout.sets;
  repsInput.value = workout.reps;
  dateInput.value = workout.date;

  formTitle.textContent = "Edit Workout";
  submitButton.textContent = "Update Workout";
  cancelButton.hidden = false;
  setMessage("Editing selected workout.");
  nameInput.focus();
}

function deleteWorkout(workoutId) {
  workouts = workouts.filter((entry) => entry.id !== workoutId);
  saveWorkouts();
  renderWorkouts();

  if (workoutIdInput.value === workoutId) {
    resetForm();
  }

  setMessage("Workout deleted.");
}

function resetForm() {
  workoutForm.reset();
  workoutIdInput.value = "";
  formTitle.textContent = "Add Workout";
  submitButton.textContent = "Save Workout";
  cancelButton.hidden = true;
  setMessage("");
}

function loadWorkouts() {
  const rawWorkouts = localStorage.getItem(STORAGE_KEY);

  if (!rawWorkouts) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawWorkouts);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to read workouts from storage.", error);
    return [];
  }
}

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function setMessage(message) {
  formMessage.textContent = message;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
