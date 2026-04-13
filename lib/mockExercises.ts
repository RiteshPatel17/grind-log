export type ExerciseType = "reps" | "time";

export type ExerciseItem = {
  name: string;
  muscle_group: string;
  equipment: string;
  exercise_type: ExerciseType;
};

export const mockExercises: ExerciseItem[] = [
  // CHEST
  { name: "Bench Press", muscle_group: "Chest", equipment: "Barbell", exercise_type: "reps" },
  { name: "Incline Dumbbell Press", muscle_group: "Chest", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Decline Bench Press", muscle_group: "Chest", equipment: "Barbell", exercise_type: "reps" },
  { name: "Cable Fly", muscle_group: "Chest", equipment: "Cable Machine", exercise_type: "reps" },
  { name: "Chest Dip", muscle_group: "Chest", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Push-Up", muscle_group: "Chest", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Pec Deck Machine", muscle_group: "Chest", equipment: "Machine", exercise_type: "reps" },
  { name: "Dumbbell Fly", muscle_group: "Chest", equipment: "Dumbbell", exercise_type: "reps" },

  // BACK
  { name: "Lat Pulldown", muscle_group: "Back", equipment: "Cable Machine", exercise_type: "reps" },
  { name: "Barbell Row", muscle_group: "Back", equipment: "Barbell", exercise_type: "reps" },
  { name: "Dumbbell Row", muscle_group: "Back", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Pull-Up", muscle_group: "Back", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Chin-Up", muscle_group: "Back", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Seated Cable Row", muscle_group: "Back", equipment: "Cable Machine", exercise_type: "reps" },
  { name: "Deadlift", muscle_group: "Back", equipment: "Barbell", exercise_type: "reps" },
  { name: "T-Bar Row", muscle_group: "Back", equipment: "Barbell", exercise_type: "reps" },
  { name: "Face Pull", muscle_group: "Back", equipment: "Cable Machine", exercise_type: "reps" },

  // SHOULDERS
  { name: "Overhead Press", muscle_group: "Shoulders", equipment: "Barbell", exercise_type: "reps" },
  { name: "Dumbbell Shoulder Press", muscle_group: "Shoulders", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Lateral Raise", muscle_group: "Shoulders", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Front Raise", muscle_group: "Shoulders", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Arnold Press", muscle_group: "Shoulders", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Cable Lateral Raise", muscle_group: "Shoulders", equipment: "Cable Machine", exercise_type: "reps" },
  { name: "Rear Delt Fly", muscle_group: "Shoulders", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Machine Shoulder Press", muscle_group: "Shoulders", equipment: "Machine", exercise_type: "reps" },

  // BICEPS
  { name: "Barbell Curl", muscle_group: "Biceps", equipment: "Barbell", exercise_type: "reps" },
  { name: "Dumbbell Curl", muscle_group: "Biceps", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Hammer Curl", muscle_group: "Biceps", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Preacher Curl", muscle_group: "Biceps", equipment: "Barbell", exercise_type: "reps" },
  { name: "Cable Curl", muscle_group: "Biceps", equipment: "Cable Machine", exercise_type: "reps" },
  { name: "Incline Dumbbell Curl", muscle_group: "Biceps", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Concentration Curl", muscle_group: "Biceps", equipment: "Dumbbell", exercise_type: "reps" },

  // TRICEPS
  { name: "Tricep Pushdown", muscle_group: "Triceps", equipment: "Cable Machine", exercise_type: "reps" },
  { name: "Skull Crusher", muscle_group: "Triceps", equipment: "Barbell", exercise_type: "reps" },
  { name: "Overhead Tricep Extension", muscle_group: "Triceps", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Close-Grip Bench Press", muscle_group: "Triceps", equipment: "Barbell", exercise_type: "reps" },
  { name: "Tricep Dip", muscle_group: "Triceps", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Diamond Push-Up", muscle_group: "Triceps", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Rope Pushdown", muscle_group: "Triceps", equipment: "Cable Machine", exercise_type: "reps" },

  // LEGS
  { name: "Squat", muscle_group: "Legs", equipment: "Barbell", exercise_type: "reps" },
  { name: "Leg Press", muscle_group: "Legs", equipment: "Machine", exercise_type: "reps" },
  { name: "Romanian Deadlift", muscle_group: "Legs", equipment: "Barbell", exercise_type: "reps" },
  { name: "Leg Curl", muscle_group: "Legs", equipment: "Machine", exercise_type: "reps" },
  { name: "Leg Extension", muscle_group: "Legs", equipment: "Machine", exercise_type: "reps" },
  { name: "Lunges", muscle_group: "Legs", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Bulgarian Split Squat", muscle_group: "Legs", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Goblet Squat", muscle_group: "Legs", equipment: "Dumbbell", exercise_type: "reps" },
  { name: "Calf Raise", muscle_group: "Legs", equipment: "Machine", exercise_type: "reps" },
  { name: "Hack Squat", muscle_group: "Legs", equipment: "Machine", exercise_type: "reps" },
  { name: "Sumo Deadlift", muscle_group: "Legs", equipment: "Barbell", exercise_type: "reps" },
  { name: "Step-Up", muscle_group: "Legs", equipment: "Dumbbell", exercise_type: "reps" },

  // CORE
  { name: "Plank", muscle_group: "Core", equipment: "Bodyweight", exercise_type: "time" },
  { name: "Side Plank", muscle_group: "Core", equipment: "Bodyweight", exercise_type: "time" },
  { name: "Crunch", muscle_group: "Core", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Bicycle Crunch", muscle_group: "Core", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Leg Raise", muscle_group: "Core", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Russian Twist", muscle_group: "Core", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Ab Wheel Rollout", muscle_group: "Core", equipment: "Other", exercise_type: "reps" },
  { name: "Cable Crunch", muscle_group: "Core", equipment: "Cable Machine", exercise_type: "reps" },
  { name: "Hanging Knee Raise", muscle_group: "Core", equipment: "Bodyweight", exercise_type: "reps" },
  { name: "Dead Bug", muscle_group: "Core", equipment: "Bodyweight", exercise_type: "reps" },

  // CARDIO
  { name: "Running", muscle_group: "Cardio", equipment: "Treadmill", exercise_type: "time" },
  { name: "Cycling", muscle_group: "Cardio", equipment: "Stationary Bike", exercise_type: "time" },
  { name: "Rowing", muscle_group: "Cardio", equipment: "Rowing Machine", exercise_type: "time" },
  { name: "Jump Rope", muscle_group: "Cardio", equipment: "Other", exercise_type: "time" },
  { name: "Stair Climber", muscle_group: "Cardio", equipment: "Machine", exercise_type: "time" },
  { name: "Elliptical", muscle_group: "Cardio", equipment: "Machine", exercise_type: "time" },
  { name: "Battle Ropes", muscle_group: "Cardio", equipment: "Other", exercise_type: "time" },
  { name: "Burpees", muscle_group: "Cardio", equipment: "Bodyweight", exercise_type: "reps" },
];