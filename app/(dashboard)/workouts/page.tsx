"use client";

import { useEffect, useMemo, useState } from "react";
import {
  mockExercises,
  type ExerciseItem,
  type ExerciseType,
} from "@/lib/mockExercises";

// One workout set inside an exercise
type WorkoutSet = {
  id: string;
  reps: string;
  weight: string;
  duration: string;
  restSeconds: string;
  completed: boolean;
};

// One exercise inside a workout template
type TemplateExercise = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  exercise_type: ExerciseType;
  isCustom: boolean;
  sets: WorkoutSet[];
};

// A full workout template
type WorkoutTemplate = {
  id: string;
  name: string;
  suggested: boolean;
  exercises: TemplateExercise[];
};

// Rest timer state
type ActiveRest = {
  exerciseId: string;
  afterSetId: string;
  initialSeconds: number;
};

// Exercise item returned from ExerciseDB route
type ApiExerciseItem = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  exercise_type: ExerciseType;
  bodyPart?: string;
  target?: string;
  gifUrl?: string;
};

// Create a blank set depending on exercise type
function createEmptySet(type: ExerciseType): WorkoutSet {
  return {
    id: crypto.randomUUID(),
    reps: "",
    weight: "",
    duration: type === "time" ? "60" : "",
    restSeconds: "120",
    completed: false,
  };
}

// Build an exercise with a chosen number of sets
function buildExercise(
  exercise: ExerciseItem,
  setCount = 3,
  isCustom = false
): TemplateExercise {
  return {
    id: crypto.randomUUID(),
    name: exercise.name,
    muscle_group: exercise.muscle_group,
    equipment: exercise.equipment,
    exercise_type: exercise.exercise_type,
    isCustom,
    sets: Array.from({ length: setCount }, () =>
      createEmptySet(exercise.exercise_type)
    ),
  };
}

// Show a short preview text for template cards
function getPreviewText(exercises: TemplateExercise[]) {
  return exercises.slice(0, 4).map((e) => e.name).join(", ");
}

// Convert seconds into m:ss format
function formatSeconds(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export default function WorkoutsPage() {
  // Example templates shown to the user
  const exampleTemplates: WorkoutTemplate[] = [
    {
      id: "strong-5x5-a",
      name: "Strong 5x5 - Workout A",
      suggested: true,
      exercises: [
        buildExercise(
          {
            name: "Squat",
            muscle_group: "Legs",
            equipment: "Barbell",
            exercise_type: "reps",
          },
          5
        ),
        buildExercise(
          {
            name: "Bench Press",
            muscle_group: "Chest",
            equipment: "Barbell",
            exercise_type: "reps",
          },
          5
        ),
        buildExercise(
          {
            name: "Barbell Row",
            muscle_group: "Back",
            equipment: "Barbell",
            exercise_type: "reps",
          },
          5
        ),
      ],
    },
    {
      id: "strong-5x5-b",
      name: "Strong 5x5 - Workout B",
      suggested: true,
      exercises: [
        buildExercise(
          {
            name: "Squat",
            muscle_group: "Legs",
            equipment: "Barbell",
            exercise_type: "reps",
          },
          5
        ),
        buildExercise(
          {
            name: "Overhead Press",
            muscle_group: "Shoulders",
            equipment: "Barbell",
            exercise_type: "reps",
          },
          5
        ),
        buildExercise(
          {
            name: "Deadlift",
            muscle_group: "Back",
            equipment: "Barbell",
            exercise_type: "reps",
          },
          1
        ),
      ],
    },
    {
      id: "legs-template",
      name: "Legs",
      suggested: true,
      exercises: [
        buildExercise(
          {
            name: "Squat",
            muscle_group: "Legs",
            equipment: "Barbell",
            exercise_type: "reps",
          },
          3
        ),
        buildExercise(
          {
            name: "Leg Extension",
            muscle_group: "Legs",
            equipment: "Machine",
            exercise_type: "reps",
          },
          3
        ),
        buildExercise(
          {
            name: "Calf Raise",
            muscle_group: "Legs",
            equipment: "Machine",
            exercise_type: "reps",
          },
          3
        ),
      ],
    },
  ];

  // Starter personal templates
  const starterMyTemplates: WorkoutTemplate[] = [
    {
      id: "push-day",
      name: "Push Day",
      suggested: false,
      exercises: [
        buildExercise(
          {
            name: "Bench Press",
            muscle_group: "Chest",
            equipment: "Barbell",
            exercise_type: "reps",
          },
          3
        ),
        buildExercise(
          {
            name: "Incline Dumbbell Press",
            muscle_group: "Chest",
            equipment: "Dumbbell",
            exercise_type: "reps",
          },
          3
        ),
      ],
    },
    {
      id: "pull-day",
      name: "Pull",
      suggested: false,
      exercises: [
        buildExercise(
          {
            name: "Lat Pulldown",
            muscle_group: "Back",
            equipment: "Cable Machine",
            exercise_type: "reps",
          },
          3
        ),
        buildExercise(
          {
            name: "Barbell Row",
            muscle_group: "Back",
            equipment: "Barbell",
            exercise_type: "reps",
          },
          3
        ),
      ],
    },
  ];

  // Template and builder state
  const [myTemplates, setMyTemplates] =
    useState<WorkoutTemplate[]>(starterMyTemplates);
  const [activeTemplate, setActiveTemplate] = useState<WorkoutTemplate | null>(
    null
  );

  // Modal state
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);

  // Form state
  const [templateName, setTemplateName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");

  // External exercise API state
  const [apiExercises, setApiExercises] = useState<ApiExerciseItem[]>([]);
  const [searchingApiExercises, setSearchingApiExercises] = useState(false);
  const [exerciseSearchError, setExerciseSearchError] = useState("");

  // Custom exercise state
  const [customName, setCustomName] = useState("");
  const [customMuscle, setCustomMuscle] = useState("Chest");
  const [customEquipment, setCustomEquipment] = useState("Bodyweight");
  const [customType, setCustomType] = useState<ExerciseType>("reps");

  // General UI message
  const [message, setMessage] = useState("");

  // Rest timer state
  const [activeRest, setActiveRest] = useState<ActiveRest | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Create dropdown list of muscle groups from mock exercise data
  const muscles = useMemo(() => {
    const groups = Array.from(
      new Set(mockExercises.map((exercise) => exercise.muscle_group))
    );
    return ["All", ...groups];
  }, []);

  // Search ExerciseDB through backend route
  async function handleSearchApiExercises(searchValue: string) {
    const trimmedValue = searchValue.trim();

    if (!trimmedValue) {
      setApiExercises([]);
      setExerciseSearchError("");
      return;
    }

    setSearchingApiExercises(true);
    setExerciseSearchError("");

    try {
      const response = await fetch(
        `/api/exercises/search?q=${encodeURIComponent(trimmedValue)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setExerciseSearchError(
          result.error || "Failed to search ExerciseDB."
        );
        setApiExercises([]);
        return;
      }

      setApiExercises(Array.isArray(result.exercises) ? result.exercises : []);
    } catch (error) {
      setExerciseSearchError("Unexpected error while searching exercises.");
      setApiExercises([]);
    } finally {
      setSearchingApiExercises(false);
    }
  }

  // Filter and combine mock exercises + API exercises
  const filteredExercises = useMemo(() => {
    const filteredMockExercises = mockExercises.filter((exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesMuscle =
        selectedMuscle === "All" || exercise.muscle_group === selectedMuscle;

      return matchesSearch && matchesMuscle;
    });

    const filteredApiExercises = apiExercises.filter((exercise) => {
      const matchesMuscle =
        selectedMuscle === "All" || exercise.muscle_group === selectedMuscle;

      return matchesMuscle;
    });

    const combined: (ExerciseItem | ApiExerciseItem)[] = [...filteredMockExercises];

    filteredApiExercises.forEach((apiExercise) => {
      const alreadyExists = combined.some(
        (exercise) =>
          exercise.name.toLowerCase() === apiExercise.name.toLowerCase()
      );

      if (!alreadyExists) {
        combined.push(apiExercise);
      }
    });

    return combined;
  }, [searchTerm, selectedMuscle, apiExercises]);

  // Countdown timer effect
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          setMessage("Rest timer finished.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  // Reset timer fully
  function resetTimerState() {
    setActiveRest(null);
    setTimeLeft(0);
    setTimerRunning(false);
  }

  // Start timer after a set is completed
  function startRestTimer(
    exerciseId: string,
    afterSetId: string,
    seconds: number
  ) {
    setActiveRest({
      exerciseId,
      afterSetId,
      initialSeconds: seconds,
    });
    setTimeLeft(seconds);
    setTimerRunning(true);
  }

  function handlePauseResumeTimer() {
    if (!activeRest) return;
    setTimerRunning((prev) => !prev);
  }

  function handleSkipTimer() {
    if (!activeRest) return;
    setTimeLeft(0);
    setTimerRunning(false);
    setMessage("Rest skipped.");
  }

  function handleResetTimer() {
    if (!activeRest) return;
    setTimeLeft(activeRest.initialSeconds);
    setTimerRunning(false);
  }

  // Validation before a set can be marked complete
  function isSetValid(set: WorkoutSet, type: ExerciseType) {
    const hasWeight = set.weight.trim() !== "";
    const hasRest = set.restSeconds.trim() !== "";

    if (type === "reps") {
      return hasWeight && hasRest && set.reps.trim() !== "";
    }

    return hasWeight && hasRest && set.duration.trim() !== "";
  }

  // Open an empty workout builder
  function handleStartEmptyWorkout() {
    const newTemplate: WorkoutTemplate = {
      id: crypto.randomUUID(),
      name: "Afternoon Workout",
      suggested: false,
      exercises: [],
    };

    setActiveTemplate(newTemplate);
    setTemplateName("Afternoon Workout");
    setIsBuilderOpen(true);
    setMessage("Started an empty workout.");
    resetTimerState();
  }

  // Start creating a template from scratch
  function handleCreateTemplate() {
    const newTemplate: WorkoutTemplate = {
      id: crypto.randomUUID(),
      name: "",
      suggested: false,
      exercises: [],
    };

    setActiveTemplate(newTemplate);
    setTemplateName("");
    setIsBuilderOpen(true);
    setMessage("Creating a new template.");
    resetTimerState();
  }

  // Open an existing template
  function handleOpenTemplate(template: WorkoutTemplate) {
    const clonedTemplate: WorkoutTemplate = {
      ...template,
      exercises: template.exercises.map((exercise) => ({
        ...exercise,
        id: crypto.randomUUID(),
        sets: exercise.sets.map((set) => ({
          ...set,
          id: crypto.randomUUID(),
          completed: false,
        })),
      })),
    };

    setActiveTemplate(clonedTemplate);
    setTemplateName(template.name);
    setIsBuilderOpen(true);
    setMessage(`Opened ${template.name}`);
    resetTimerState();
  }

  // Save template into "My Templates"
  function handleSaveTemplate() {
    if (!activeTemplate) return;

    if (!templateName.trim()) {
      setMessage("Please enter a template name.");
      return;
    }

    const savedTemplate: WorkoutTemplate = {
      ...activeTemplate,
      name: templateName.trim(),
      suggested: false,
    };

    setMyTemplates((prev) => {
      const exists = prev.some((template) => template.id === savedTemplate.id);

      if (exists) {
        return prev.map((template) =>
          template.id === savedTemplate.id ? savedTemplate : template
        );
      }

      return [savedTemplate, ...prev];
    });

    setActiveTemplate(savedTemplate);
    setMessage("Template saved locally.");
  }

  // Finish workout and save it as a template
  function handleFinishWorkout() {
    if (!activeTemplate) return;

    const finalName = templateName.trim() || "Untitled Workout";

    const finishedTemplate: WorkoutTemplate = {
      ...activeTemplate,
      name: finalName,
      suggested: false,
    };

    setMyTemplates((prev) => {
      const exists = prev.some(
        (template) => template.id === finishedTemplate.id
      );

      if (exists) {
        return prev.map((template) =>
          template.id === finishedTemplate.id ? finishedTemplate : template
        );
      }

      return [finishedTemplate, ...prev];
    });

    setActiveTemplate(null);
    setTemplateName("");
    setIsBuilderOpen(false);
    setIsExercisePickerOpen(false);
    setSearchTerm("");
    setApiExercises([]);
    setExerciseSearchError("");
    resetTimerState();
    setMessage(`Workout "${finalName}" saved successfully.`);
  }

  // Add a chosen exercise into the active template
  function handleAddExercise(
    exercise: ExerciseItem | ApiExerciseItem,
    isCustom = false
  ) {
    if (!activeTemplate) return;

    const newExercise: TemplateExercise = {
      id: crypto.randomUUID(),
      name: exercise.name,
      muscle_group: exercise.muscle_group,
      equipment: exercise.equipment,
      exercise_type: exercise.exercise_type,
      isCustom,
      sets: [
        createEmptySet(exercise.exercise_type),
        createEmptySet(exercise.exercise_type),
      ],
    };

    setActiveTemplate({
      ...activeTemplate,
      exercises: [...activeTemplate.exercises, newExercise],
    });

    setMessage(`${exercise.name} added.`);
    setIsExercisePickerOpen(false);
    setSearchTerm("");
    setApiExercises([]);
    setExerciseSearchError("");
  }

  // Create and add a custom exercise
  function handleCreateCustomExercise() {
    if (!customName.trim()) {
      alert("Please enter a custom exercise name first.");
      return;
    }

    handleAddExercise(
      {
        id: crypto.randomUUID(),
        name: customName.trim(),
        muscle_group: customMuscle,
        equipment: customEquipment,
        exercise_type: customType,
      },
      true
    );

    setCustomName("");
    setCustomMuscle("Chest");
    setCustomEquipment("Bodyweight");
    setCustomType("reps");
  }

  // Add a set to an exercise
  function handleAddSet(exerciseId: string, type: ExerciseType) {
    if (!activeTemplate) return;

    setActiveTemplate({
      ...activeTemplate,
      exercises: activeTemplate.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [...exercise.sets, createEmptySet(type)],
            }
          : exercise
      ),
    });
  }

  // Mark set complete and optionally start rest timer
  function handleCompleteSet(
    exerciseId: string,
    setId: string,
    restSeconds: string,
    isLastSet: boolean,
    type: ExerciseType
  ) {
    if (!activeTemplate) return;

    const exercise = activeTemplate.exercises.find((e) => e.id === exerciseId);
    const set = exercise?.sets.find((s) => s.id === setId);

    if (!exercise || !set) {
      alert("Unable to find the selected set.");
      return;
    }

    if (!isSetValid(set, type)) {
      alert("Please fill the required values first.");
      return;
    }

    setActiveTemplate({
      ...activeTemplate,
      exercises: activeTemplate.exercises.map((exerciseItem) =>
        exerciseItem.id === exerciseId
          ? {
              ...exerciseItem,
              sets: exerciseItem.sets.map((setItem) =>
                setItem.id === setId
                  ? { ...setItem, completed: true }
                  : setItem
              ),
            }
          : exerciseItem
      ),
    });

    if (!isLastSet) {
      const seconds = Number(restSeconds || "120");
      startRestTimer(exerciseId, setId, seconds);
      setMessage("Set completed. Rest timer started.");
    } else {
      resetTimerState();
      setMessage("Set completed.");
    }
  }

  // Update a field inside a set
  function handleUpdateSet(
    exerciseId: string,
    setId: string,
    field: keyof WorkoutSet,
    value: string
  ) {
    if (!activeTemplate) return;

    setActiveTemplate({
      ...activeTemplate,
      exercises: activeTemplate.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      ),
    });
  }

  // Remove one set
  function handleRemoveSet(exerciseId: string, setId: string) {
    if (!activeTemplate) return;

    setActiveTemplate({
      ...activeTemplate,
      exercises: activeTemplate.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise
      ),
    });

    if (activeRest?.afterSetId === setId) {
      resetTimerState();
    }
  }

  // Remove one exercise
  function handleRemoveExercise(exerciseId: string) {
    if (!activeTemplate) return;

    setActiveTemplate({
      ...activeTemplate,
      exercises: activeTemplate.exercises.filter(
        (exercise) => exercise.id !== exerciseId
      ),
    });

    if (activeRest?.exerciseId === exerciseId) {
      resetTimerState();
    }
  }

  // Undo a completed set
  function handleUndoCompleteSet(exerciseId: string, setId: string) {
    if (!activeTemplate) return;

    setActiveTemplate({
      ...activeTemplate,
      exercises: activeTemplate.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, completed: false } : set
              ),
            }
          : exercise
      ),
    });

    if (activeRest?.afterSetId === setId) {
      resetTimerState();
    }

    setMessage("Set marked as incomplete.");
  }

  // Calculate width of timer bar
  function getTimerWidth(initialSeconds: number, currentSeconds: number) {
    if (initialSeconds <= 0) return "0%";
    const percent = Math.max((currentSeconds / initialSeconds) * 100, 0);
    return `${percent}%`;
  }

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#2845D6]">New in 6.0</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Start Workout
            </h1>
          </div>

          <button className="w-full rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm font-semibold text-[#2845D6] transition hover:border-[#2845D6] sm:w-auto">
            Search
          </button>
        </div>

        {/* Status message */}
        {message && (
          <p className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {message}
          </p>
        )}

        {/* Quick start */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Quick Start
          </h2>

          <button
            onClick={handleStartEmptyWorkout}
            className="mt-5 w-full rounded-2xl bg-[#2845D6] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#1A2CA3] sm:text-xl"
          >
            Start an Empty Workout
          </button>
        </div>

        {/* Templates heading */}
        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Templates
          </h2>

          <button
            onClick={handleCreateTemplate}
            className="w-full rounded-2xl bg-[#2845D6]/15 px-5 py-3 font-semibold text-[#2845D6] transition hover:bg-[#2845D6]/25 sm:w-auto"
          >
            + Template
          </button>
        </div>

        {/* My templates */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white sm:text-2xl">
            My Templates ({myTemplates.length})
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-2xl border border-neutral-700 bg-neutral-900 p-5 sm:rounded-[28px] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="max-w-[70%] text-xl font-bold text-white sm:text-2xl">
                    {template.name}
                  </h4>

                  <button
                    onClick={() => handleOpenTemplate(template)}
                    className="rounded-2xl bg-[#2845D6]/15 px-4 py-2 text-sm font-semibold text-[#2845D6] transition hover:bg-[#2845D6]/25"
                  >
                    Open
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-neutral-400 sm:text-lg sm:leading-8">
                  {getPreviewText(template.exercises)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Example templates */}
        <div className="mt-10 pb-10">
          <h3 className="text-xl font-semibold text-white sm:text-2xl">
            Example Templates ({exampleTemplates.length})
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {exampleTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-2xl border border-neutral-700 bg-neutral-900 p-5 sm:rounded-[28px] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="max-w-[70%] text-xl font-bold text-white sm:text-2xl">
                    {template.name}
                  </h4>

                  <button
                    onClick={() => handleOpenTemplate(template)}
                    className="rounded-2xl bg-[#2845D6]/15 px-4 py-2 text-sm font-semibold text-[#2845D6] transition hover:bg-[#2845D6]/25"
                  >
                    Use
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-neutral-400 sm:text-lg sm:leading-8">
                  {getPreviewText(template.exercises)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workout builder modal */}
      {isBuilderOpen && activeTemplate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-3 sm:p-4 md:left-64">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-neutral-800 bg-[#1f2733] p-4 shadow-2xl sm:p-6">
            {/* Modal top buttons */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setIsBuilderOpen(false)}
                className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-white transition hover:bg-neutral-800 sm:w-auto"
              >
                Close
              </button>

              <button
                onClick={handleFinishWorkout}
                className="w-full rounded-2xl bg-green-500 px-6 py-3 text-base font-bold text-white transition hover:bg-green-600 sm:w-auto sm:text-lg"
              >
                Finish
              </button>
            </div>

            {/* Workout name */}
            <div className="mb-6">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Workout or template name"
                className="w-full rounded-2xl border border-neutral-700 bg-[#263140] px-5 py-4 text-2xl font-bold text-white outline-none transition focus:border-[#2845D6] sm:text-3xl"
              />
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-400 sm:gap-6">
                <span>Apr 8, 2026</span>
                <span>0:18</span>
              </div>
            </div>

            <div className="space-y-4">
              {activeTemplate.exercises.length === 0 ? (
                <>
                  <button
                    onClick={() => {
                      setIsExercisePickerOpen(true);
                      setSearchTerm("");
                      setApiExercises([]);
                      setExerciseSearchError("");
                    }}
                    className="w-full rounded-2xl bg-[#2845D6]/70 px-6 py-4 text-xl font-bold text-white transition hover:bg-[#2845D6] sm:text-2xl"
                  >
                    Add Exercises
                  </button>

                  <button
                    onClick={() => setIsBuilderOpen(false)}
                    className="w-full rounded-2xl bg-red-500/20 px-6 py-4 text-xl font-bold text-red-300 transition hover:bg-red-500/30 sm:text-2xl"
                  >
                    Cancel Workout
                  </button>
                </>
              ) : (
                <>
                  {/* Builder action buttons */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      onClick={() => {
                        setIsExercisePickerOpen(true);
                        setSearchTerm("");
                        setApiExercises([]);
                        setExerciseSearchError("");
                      }}
                      className="w-full rounded-2xl bg-[#2845D6]/70 px-5 py-3 font-bold text-white transition hover:bg-[#2845D6] sm:w-auto"
                    >
                      Add Exercise
                    </button>

                    <button
                      onClick={handleSaveTemplate}
                      className="w-full rounded-2xl bg-[#2845D6] px-5 py-3 font-bold text-white transition hover:bg-[#1A2CA3] sm:w-auto"
                    >
                      Save Template
                    </button>
                  </div>

                  {/* Exercise cards */}
                  <div className="mt-6 space-y-6">
                    {activeTemplate.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={exercise.id}
                        className="rounded-2xl border border-neutral-700 bg-neutral-900 p-4 sm:rounded-[28px] sm:p-5"
                      >
                        {/* Exercise header */}
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-[#49a8ff] sm:text-2xl">
                              {exerciseIndex + 1}. {exercise.name}
                            </h3>
                            <p className="mt-2 text-sm text-neutral-400">
                              {exercise.muscle_group} • {exercise.equipment} •{" "}
                              {exercise.exercise_type}
                              {exercise.isCustom ? " • Custom" : ""}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRemoveExercise(exercise.id)}
                            className="rounded-2xl bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/25"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Desktop headings */}
                        <div className="mt-6 hidden gap-4 px-2 text-sm font-semibold uppercase tracking-wide text-neutral-400 md:grid md:grid-cols-[140px_1fr_1fr_1fr_90px]">
                          <div>Set</div>
                          <div>
                            {exercise.exercise_type === "reps"
                              ? "Reps"
                              : "Duration"}
                          </div>
                          <div>Weight (lb)</div>
                          <div>Rest (sec)</div>
                          <div className="text-center">Done</div>
                        </div>

                        <div className="mt-3 space-y-4">
                          {exercise.sets.map((set, setIndex) => {
                            const isLastSet =
                              setIndex === exercise.sets.length - 1;
                            const isActiveRest =
                              activeRest?.exerciseId === exercise.id &&
                              activeRest?.afterSetId === set.id;

                            return (
                              <div key={set.id} className="space-y-3">
                                {/* Set row/card */}
                                <div
                                  className={`rounded-2xl border p-4 ${
                                    set.completed
                                      ? "border-green-500/30 bg-green-500/10"
                                      : "border-neutral-700 bg-[#263140]"
                                  }`}
                                >
                                  <div className="mb-4 flex items-center justify-between">
                                    <span className="text-lg font-semibold text-white">
                                      Set {setIndex + 1}
                                    </span>

                                    {exercise.sets.length > 2 && (
                                      <button
                                        onClick={() =>
                                          handleRemoveSet(exercise.id, set.id)
                                        }
                                        className="text-sm text-red-300 hover:underline"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>

                                  {/* Mobile/tablet fields */}
                                  <div className="grid gap-4 md:grid-cols-[140px_1fr_1fr_1fr_90px]">
                                    {exercise.exercise_type === "reps" ? (
                                      <div>
                                        <label className="mb-2 block text-xs font-medium text-neutral-300 md:hidden">
                                          Reps
                                        </label>
                                        <input
                                          type="number"
                                          value={set.reps}
                                          onChange={(e) =>
                                            handleUpdateSet(
                                              exercise.id,
                                              set.id,
                                              "reps",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Reps"
                                          className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <label className="mb-2 block text-xs font-medium text-neutral-300 md:hidden">
                                          Duration
                                        </label>
                                        <input
                                          type="number"
                                          value={set.duration}
                                          onChange={(e) =>
                                            handleUpdateSet(
                                              exercise.id,
                                              set.id,
                                              "duration",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Duration (sec)"
                                          className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                                        />
                                      </div>
                                    )}

                                    <div>
                                      <label className="mb-2 block text-xs font-medium text-neutral-300 md:hidden">
                                        Weight (lb)
                                      </label>
                                      <input
                                        type="number"
                                        value={set.weight}
                                        onChange={(e) =>
                                          handleUpdateSet(
                                            exercise.id,
                                            set.id,
                                            "weight",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Weight (lb)"
                                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                                      />
                                    </div>

                                    <div>
                                      <label className="mb-2 block text-xs font-medium text-neutral-300 md:hidden">
                                        Rest (sec)
                                      </label>
                                      <input
                                        type="number"
                                        value={set.restSeconds}
                                        onChange={(e) =>
                                          handleUpdateSet(
                                            exercise.id,
                                            set.id,
                                            "restSeconds",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Rest (sec)"
                                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                                      />
                                    </div>

                                    <div className="flex items-end justify-start md:justify-center">
                                      {set.completed ? (
                                        <button
                                          onClick={() =>
                                            handleUndoCompleteSet(
                                              exercise.id,
                                              set.id
                                            )
                                          }
                                          className="flex h-12 w-12 items-center justify-center rounded-xl border border-green-500/40 bg-green-500/20 text-lg font-bold text-green-300 transition hover:bg-green-500/30"
                                        >
                                          ✓
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            handleCompleteSet(
                                              exercise.id,
                                              set.id,
                                              set.restSeconds,
                                              isLastSet,
                                              exercise.exercise_type
                                            )
                                          }
                                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-lg font-bold text-white transition hover:bg-green-600"
                                        >
                                          ✓
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Rest timer display */}
                                {!isLastSet && (
                                  <div className="space-y-3">
                                    {isActiveRest && timeLeft > 0 ? (
                                      <>
                                        <div className="relative overflow-hidden rounded-2xl border-2 border-white/70 bg-neutral-900">
                                          <div
                                            className="h-14 bg-[#49a8ff] transition-all duration-1000"
                                            style={{
                                              width: activeRest
                                                ? getTimerWidth(
                                                    activeRest.initialSeconds,
                                                    timeLeft
                                                  )
                                                : "100%",
                                            }}
                                          />
                                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-bold text-white sm:text-2xl">
                                            {formatSeconds(timeLeft)}
                                          </div>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-3">
                                          <button
                                            onClick={handlePauseResumeTimer}
                                            className="rounded-xl bg-neutral-900 px-4 py-2 font-semibold text-white transition hover:bg-neutral-800"
                                          >
                                            {timerRunning ? "Pause" : "Resume"}
                                          </button>

                                          <button
                                            onClick={handleResetTimer}
                                            className="rounded-xl bg-neutral-900 px-4 py-2 font-semibold text-white transition hover:bg-neutral-800"
                                          >
                                            Reset
                                          </button>

                                          <button
                                            onClick={handleSkipTimer}
                                            className="rounded-xl bg-[#2845D6] px-4 py-2 font-semibold text-white transition hover:bg-[#1A2CA3]"
                                          >
                                            Skip
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex items-center justify-center">
                                        <div className="rounded-full px-4 py-1 text-base font-semibold text-[#49a8ff] sm:text-lg">
                                          {formatSeconds(
                                            Number(set.restSeconds || "120")
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Add set button */}
                        <button
                          onClick={() =>
                            handleAddSet(exercise.id, exercise.exercise_type)
                          }
                          className="mt-4 w-full rounded-2xl bg-neutral-950 px-4 py-4 text-xl font-bold text-white transition hover:bg-[#1A2CA3] sm:text-2xl"
                        >
                          + Add Set (2:00)
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exercise picker modal */}
      {isExercisePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 md:left-64">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-neutral-800 bg-[#1f2733] p-4 shadow-2xl sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => {
                  setIsExercisePickerOpen(false);
                  setSearchTerm("");
                  setApiExercises([]);
                  setExerciseSearchError("");
                }}
                className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-white transition hover:bg-neutral-800 sm:w-auto"
              >
                Close
              </button>

              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Add Exercise
              </h2>
            </div>

            {/* Search + filter */}
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  handleSearchApiExercises(value);
                }}
                placeholder="Search mock + ExerciseDB"
                className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6] md:col-span-2"
              />

              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
              >
                {muscles.map((muscle) => (
                  <option key={muscle} value={muscle}>
                    {muscle}
                  </option>
                ))}
              </select>
            </div>

            {/* Search state messages */}
            <div className="mt-4 space-y-2">
              {searchingApiExercises && (
                <p className="text-sm text-neutral-400">
                  Searching ExerciseDB...
                </p>
              )}

              {exerciseSearchError && (
                <p className="text-sm text-red-300">{exerciseSearchError}</p>
              )}

              {!searchingApiExercises &&
                !exerciseSearchError &&
                searchTerm.trim() && (
                  <p className="text-sm text-neutral-400">
                    Showing matching exercises from mock data and ExerciseDB.
                  </p>
                )}
            </div>

            {/* Exercise list */}
            <div className="mt-6 space-y-3">
              {filteredExercises.map((exercise) => {
                const isApiExercise = "id" in exercise && !mockExercises.some(
                  (mockExercise) =>
                    mockExercise.name.toLowerCase() ===
                    exercise.name.toLowerCase()
                );

                return (
                  <div
                    key={`${exercise.name}-${exercise.equipment}`}
                    className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white sm:text-lg">
                          {exercise.name}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                            isApiExercise
                              ? "bg-[#AD49E1]/15 text-[#AD49E1]"
                              : "bg-[#2845D6]/15 text-[#2845D6]"
                          }`}
                        >
                          {isApiExercise ? "API" : "Mock"}
                        </span>
                      </div>

                      <p className="text-sm text-neutral-400">
                        {exercise.muscle_group} • {exercise.equipment} •{" "}
                        {exercise.exercise_type}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddExercise(exercise)}
                      className="w-full rounded-2xl bg-[#2845D6]/15 px-4 py-2 text-sm font-semibold text-[#2845D6] transition hover:bg-[#2845D6]/25 sm:w-auto"
                    >
                      Add
                    </button>
                  </div>
                );
              })}

              {!searchingApiExercises && filteredExercises.length === 0 && (
                <p className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-400">
                  No exercises found. Try another search or create a custom
                  exercise below.
                </p>
              )}
            </div>

            {/* Custom exercise builder */}
            <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
              <h3 className="text-lg font-semibold text-white sm:text-xl">
                Create Custom Exercise
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Exercise name"
                  className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                />

                <select
                  value={customMuscle}
                  onChange={(e) => setCustomMuscle(e.target.value)}
                  className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                >
                  {muscles
                    .filter((muscle) => muscle !== "All")
                    .map((muscle) => (
                      <option key={muscle} value={muscle}>
                        {muscle}
                      </option>
                    ))}
                </select>

                <select
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                >
                  <option>Bodyweight</option>
                  <option>Barbell</option>
                  <option>Dumbbell</option>
                  <option>Machine</option>
                  <option>Cable Machine</option>
                  <option>Treadmill</option>
                  <option>Stationary Bike</option>
                  <option>Rowing Machine</option>
                  <option>Other</option>
                </select>

                <select
                  value={customType}
                  onChange={(e) =>
                    setCustomType(e.target.value as ExerciseType)
                  }
                  className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                >
                  <option value="reps">Reps Based</option>
                  <option value="time">Time Based</option>
                </select>
              </div>

              <button
                onClick={handleCreateCustomExercise}
                className="mt-4 w-full rounded-2xl bg-[#2845D6] px-5 py-3 font-bold text-white transition hover:bg-[#1A2CA3] sm:w-auto"
              >
                Add Custom Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}