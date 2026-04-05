const STORAGE_KEY = "workout-tracker-v2-workouts";

const workoutForm = document.getElementById("workout-form");
const dateInput = document.getElementById("date");
const notesInput = document.getElementById("notes");
const exerciseList = document.getElementById("exercise-list");
const addExerciseButton = document.getElementById("add-exercise-button");
const submitButton = document.getElementById("submit-button");
const cancelEditButton = document.getElementById("cancel-edit-button");
const editingLabel = document.getElementById("editing-label");
const formMessage = document.getElementById("form-message");
const workoutList = document.getElementById("workout-list");
const emptyState = document.getElementById("empty-state");
const exerciseRowTemplate = document.getElementById("exercise-row-template");

let workouts = loadWorkouts();
let editingWorkoutId = null;

console.log("App initialized");

setupApp();

function setupApp() {
  ensureAtLeastOneExerciseRow();
  renderWorkouts();

  workoutForm.addEventListener("submit", handleFormSubmit);
  addExerciseButton.addEventListener("click", handleAddExercise);
  cancelEditButton.addEventListener("click", handleCancelEdit);
  exerciseList.addEventListener("click", handleExerciseListClick);
  workoutList.addEventListener("click", handleWorkoutListClick);
}

function handleFormSubmit(event) {
  event.preventDefault();

  const workout = collectWorkoutFromForm();
  if (!workout) {
    return;
  }

  console.log("Saving workout:", workout);

  if (editingWorkoutId) {
    updateWorkout(workout);
  } else {
    saveNewWorkout(workout);
  }
}

function handleAddExercise() {
  addExerciseRow();
  setFormMessage("");
}

function handleCancelEdit() {
  resetForm();
}

function handleExerciseListClick(event) {
  const removeButton = event.target.closest(".remove-exercise-button");
  if (!removeButton) {
    return;
  }

  if (getExerciseRows().length === 1) {
    setFormMessage("At least one exercise is required.");
    return;
  }

  const row = removeButton.closest(".exercise-row");
  row.remove();
  setFormMessage("");
}

function handleWorkoutListClick(event) {
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
}

function collectWorkoutFromForm() {
  const date = dateInput.value;
  const notes = notesInput.value.trim();
  const exercises = collectExercises();

  if (!date) {
    setFormMessage("Date is required.");
    return null;
  }

  if (!exercises) {
    return null;
  }

  return {
    id: editingWorkoutId || createWorkoutId(),
    date,
    notes,
    exercises
  };
}

function collectExercises() {
  const rows = getExerciseRows();

  if (rows.length === 0) {
    setFormMessage("At least one exercise is required.");
    return null;
  }

  const exercises = [];

  for (const row of rows) {
    const nameInput = row.querySelector(".exercise-name");
    const setsInput = row.querySelector(".exercise-sets");
    const repsInput = row.querySelector(".exercise-reps");

    const name = nameInput.value.trim();
    const sets = Number(setsInput.value);
    const reps = Number(repsInput.value);

    if (!name || !setsInput.value || !repsInput.value) {
      setFormMessage("All exercise fields are required.");
      return null;
    }

    if (!Number.isInteger(sets) || sets < 1 || !Number.isInteger(reps) || reps < 1) {
      setFormMessage("Sets and reps must be positive integers.");
      return null;
    }

    exercises.push({
      name,
      sets,
      reps
    });
  }

  return exercises;
}

function saveNewWorkout(workout) {
  workouts.push(workout);
  saveWorkouts();
  renderWorkouts();
  resetForm();
}

function updateWorkout(updatedWorkout) {
  workouts = workouts.map((workout) => {
    if (workout.id === editingWorkoutId) {
      return updatedWorkout;
    }

    return workout;
  });

  saveWorkouts();
  renderWorkouts();
  resetForm();
}

function startEditWorkout(workoutId) {
  const workout = workouts.find((item) => item.id === workoutId);
  if (!workout) {
    return;
  }

  editingWorkoutId = workout.id;
  dateInput.value = workout.date;
  notesInput.value = workout.notes;

  exerciseList.innerHTML = "";

  for (const exercise of workout.exercises) {
    addExerciseRow(exercise);
  }

  submitButton.textContent = "Update Workout";
  cancelEditButton.hidden = false;
  editingLabel.hidden = false;
  setFormMessage("");
}

function deleteWorkout(workoutId) {
  workouts = workouts.filter((workout) => workout.id !== workoutId);
  saveWorkouts();
  renderWorkouts();

  if (editingWorkoutId === workoutId) {
    resetForm();
  }
}

function resetForm() {
  workoutForm.reset();
  editingWorkoutId = null;
  exerciseList.innerHTML = "";
  ensureAtLeastOneExerciseRow();
  submitButton.textContent = "Create Workout";
  cancelEditButton.hidden = true;
  editingLabel.hidden = true;
  setFormMessage("");
}

function ensureAtLeastOneExerciseRow() {
  if (getExerciseRows().length === 0) {
    addExerciseRow();
  }
}

function addExerciseRow(exercise = {}) {
  const rowFragment = exerciseRowTemplate.content.cloneNode(true);
  const row = rowFragment.querySelector(".exercise-row");

  row.querySelector(".exercise-name").value = exercise.name || "";
  row.querySelector(".exercise-sets").value = exercise.sets || "";
  row.querySelector(".exercise-reps").value = exercise.reps || "";

  exerciseList.appendChild(row);
}

function getExerciseRows() {
  return Array.from(exerciseList.querySelectorAll(".exercise-row"));
}

function renderWorkouts() {
  workoutList.innerHTML = "";

  if (workouts.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  workouts.forEach((workout) => {
    const workoutCard = document.createElement("article");
    workoutCard.className = "workout-card";

    const notesHtml = workout.notes
      ? `<p class="workout-notes">${escapeHtml(workout.notes)}</p>`
      : "";

    const exercisesHtml = (workout.exercises || [])
      .map((exercise) => {
        return `<li class="exercise-item">${escapeHtml(exercise.name)} - ${exercise.sets} sets x ${exercise.reps} reps</li>`;
      })
      .join("");

    workoutCard.innerHTML = `
      <div class="workout-card-header">
        <div>
          <h3 class="workout-date">${formatDate(workout.date)}</h3>
          ${notesHtml}
        </div>
        <div class="workout-actions">
          <button type="button" class="edit-button secondary-button" data-id="${workout.id}">Edit</button>
          <button type="button" class="delete-button" data-id="${workout.id}">Delete</button>
        </div>
      </div>
      <ul class="workout-exercises">${exercisesHtml}</ul>
    `;

    workoutList.appendChild(workoutCard);
  });
}

function loadWorkouts() {
  const storedWorkouts = localStorage.getItem(STORAGE_KEY);

  if (!storedWorkouts) {
    return [];
  }

  try {
    const parsedWorkouts = JSON.parse(storedWorkouts);
    return Array.isArray(parsedWorkouts) ? parsedWorkouts : [];
  } catch (error) {
    console.error("Could not load workouts from localStorage.", error);
    return [];
  }
}

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function createWorkoutId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `workout-${Date.now()}`;
}

function setFormMessage(message) {
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


