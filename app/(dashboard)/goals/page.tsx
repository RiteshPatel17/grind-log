"use client";

import { useEffect, useMemo, useState } from "react";

// Goals page
// This page lets the user:
// 1. Load saved goals from the API
// 2. View goals in summary cards
// 3. Edit goals only when needed
// 4. Save updated goals through the API
// 5. See a simple goal breakdown and guidance section
export default function GoalsPage() {
  // Form state values
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState("");
  const [weeklyWorkoutGoal, setWeeklyWorkoutGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  // Original values loaded from backend
  const [originalGoals, setOriginalGoals] = useState<{
    daily_calorie_goal: string;
    weekly_workout_goal: string;
    target_weight: string;
  } | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasSavedGoals, setHasSavedGoals] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load goals once when page opens
  useEffect(() => {
    async function loadGoals() {
      setLoading(true);
      setMessage("");
      setErrorMessage("");

      try {
        const response = await fetch("/api/goals", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          setErrorMessage(result.error || "Failed to load goals.");
          setLoading(false);
          return;
        }

        const data = result.goals;

        if (data) {
          const loadedGoals = {
            daily_calorie_goal: data.daily_calorie_goal
              ? String(data.daily_calorie_goal)
              : "",
            weekly_workout_goal: data.weekly_workout_goal
              ? String(data.weekly_workout_goal)
              : "",
            target_weight: data.target_weight ? String(data.target_weight) : "",
          };

          setDailyCalorieGoal(loadedGoals.daily_calorie_goal);
          setWeeklyWorkoutGoal(loadedGoals.weekly_workout_goal);
          setTargetWeight(loadedGoals.target_weight);

          setOriginalGoals(loadedGoals);
          setHasSavedGoals(true);
          setIsEditing(false);
        } else {
          setHasSavedGoals(false);
          setIsEditing(true);
        }
      } catch (error) {
        setErrorMessage("Unexpected error while loading goals.");
      } finally {
        setLoading(false);
      }
    }

    loadGoals();
  }, []);

  // Enable edit mode
  function handleEdit() {
    setIsEditing(true);
    setMessage("");
    setErrorMessage("");
  }

  // Cancel editing and restore original values
  function handleCancel() {
    if (originalGoals) {
      setDailyCalorieGoal(originalGoals.daily_calorie_goal);
      setWeeklyWorkoutGoal(originalGoals.weekly_workout_goal);
      setTargetWeight(originalGoals.target_weight);
    }

    setIsEditing(false);
    setMessage("");
    setErrorMessage("");
  }

  // Save goals through API route
  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    if (
      !dailyCalorieGoal.trim() ||
      !weeklyWorkoutGoal.trim() ||
      !targetWeight.trim()
    ) {
      setErrorMessage("Please fill all goal fields first.");
      setSaving(false);
      return;
    }

    const currentGoals = {
      daily_calorie_goal: dailyCalorieGoal.trim(),
      weekly_workout_goal: weeklyWorkoutGoal.trim(),
      target_weight: targetWeight.trim(),
    };

    // If nothing changed, do not send another request
    if (
      originalGoals &&
      currentGoals.daily_calorie_goal === originalGoals.daily_calorie_goal &&
      currentGoals.weekly_workout_goal === originalGoals.weekly_workout_goal &&
      currentGoals.target_weight === originalGoals.target_weight
    ) {
      setMessage("No changes to save.");
      setSaving(false);
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          daily_calorie_goal: Number(currentGoals.daily_calorie_goal),
          weekly_workout_goal: Number(currentGoals.weekly_workout_goal),
          target_weight: Number(currentGoals.target_weight),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to save goals.");
        setSaving(false);
        return;
      }

      setOriginalGoals(currentGoals);
      setHasSavedGoals(true);
      setIsEditing(false);
      setMessage(result.message || "Goals saved successfully.");
    } catch (error) {
      setErrorMessage("Unexpected error while saving goals.");
    } finally {
      setSaving(false);
    }
  }

  // Simple derived display values
  const goalBreakdown = useMemo(() => {
    const dailyCalories = Number(dailyCalorieGoal || 0);
    const weeklyWorkouts = Number(weeklyWorkoutGoal || 0);
    const weightGoal = Number(targetWeight || 0);

    return {
      dailyCalories,
      weeklyWorkouts,
      weightGoal,
      weeklyCalories: dailyCalories > 0 ? dailyCalories * 7 : 0,
      avgRestDays:
        weeklyWorkouts > 0 && weeklyWorkouts <= 7 ? 7 - weeklyWorkouts : 0,
    };
  }, [dailyCalorieGoal, weeklyWorkoutGoal, targetWeight]);

  // Loading state UI
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Fitness <span className="text-[#AD49E1]">Goals</span>
        </h1>
        <p className="mt-4 text-neutral-400 sm:mt-6">Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page heading and action button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Fitness <span className="text-[#AD49E1]">Goals</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-400 sm:mt-3 sm:text-base">
            Set and manage your weight, calorie, and workout goals.
          </p>
        </div>

        {/* Show edit button only when goals already exist and user is not editing */}
        {hasSavedGoals && !isEditing && (
          <button
            onClick={handleEdit}
            className="w-full rounded-xl bg-[#2845D6] px-6 py-3 font-bold text-white transition hover:bg-[#1A2CA3] sm:w-auto"
          >
            Edit Goals
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {[
          { label: "Daily Calories", value: dailyCalorieGoal || "-" },
          { label: "Weekly Workouts", value: weeklyWorkoutGoal || "-" },
          { label: "Target Weight", value: targetWeight || "-" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6"
          >
            <h2 className="text-base font-semibold text-[#2845D6] sm:text-lg">
              {card.label}
            </h2>
            <p className="mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Goal breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6">
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Weekly Calorie Target
          </h2>
          <p className="mt-3 text-3xl font-bold text-[#AD49E1]">
            {goalBreakdown.weeklyCalories || "-"}
          </p>
          <p className="mt-2 text-sm text-neutral-400">
            Based on your daily calorie goal multiplied across 7 days.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6">
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Planned Rest Days
          </h2>
          <p className="mt-3 text-3xl font-bold text-[#AD49E1]">
            {goalBreakdown.avgRestDays >= 0 ? goalBreakdown.avgRestDays : "-"}
          </p>
          <p className="mt-2 text-sm text-neutral-400">
            Estimated from your weekly workout goal.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6">
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Goal Focus
          </h2>
          <p className="mt-3 text-base font-semibold text-[#AD49E1]">
            {goalBreakdown.weeklyWorkouts >= 5
              ? "High consistency"
              : goalBreakdown.weeklyWorkouts >= 3
                ? "Balanced routine"
                : "Light routine"}
          </p>
          <p className="mt-2 text-sm text-neutral-400">
            This is a simple summary of your current target setup.
          </p>
        </div>
      </div>

      {/* Tips / guidance section */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Goal Guidance
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-800 bg-black p-4">
            <h3 className="text-base font-semibold text-[#2845D6]">
              Nutrition Plan
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Your current daily calorie target is{" "}
              <span className="font-semibold text-white">
                {dailyCalorieGoal || "-"}
              </span>
              . Try to stay consistent across the week for better progress
              tracking.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-black p-4">
            <h3 className="text-base font-semibold text-[#2845D6]">
              Training Plan
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Your weekly workout goal is{" "}
              <span className="font-semibold text-white">
                {weeklyWorkoutGoal || "-"}
              </span>
              . Aim to spread workouts through the week instead of stacking them
              all in one or two days.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-black p-4">
            <h3 className="text-base font-semibold text-[#2845D6]">
              Weight Target
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Your target weight is{" "}
              <span className="font-semibold text-white">
                {targetWeight || "-"}
              </span>
              . Keep logging weight regularly on the Progress page to track your
              trend over time.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-black p-4">
            <h3 className="text-base font-semibold text-[#2845D6]">
              Best Practice
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Review your goals every week and update them only when your plan
              changes. This keeps your dashboard data clean and meaningful.
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      {/* Success message */}
      {message && (
        <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {message}
        </p>
      )}

      {/* Edit form */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6"
        >
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Edit Goals
          </h2>

          <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-2">
            {[
              {
                label: "Daily Calorie Goal",
                value: dailyCalorieGoal,
                setter: setDailyCalorieGoal,
                placeholder: "e.g. 2200",
                step: undefined,
              },
              {
                label: "Weekly Workout Goal",
                value: weeklyWorkoutGoal,
                setter: setWeeklyWorkoutGoal,
                placeholder: "e.g. 5",
                step: undefined,
              },
              {
                label: "Target Weight",
                value: targetWeight,
                setter: setTargetWeight,
                placeholder: "e.g. 75",
                step: "0.1",
              },
            ].map((field) => (
              <div key={field.label}>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  {field.label}
                </label>
                <input
                  type="number"
                  step={field.step}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                />
              </div>
            ))}
          </div>

          {/* Form action buttons */}
          <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#2845D6] px-6 py-3 font-bold text-white transition hover:bg-[#1A2CA3] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {hasSavedGoals && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-neutral-700 px-6 py-3 font-bold text-white transition hover:border-[#2845D6] hover:text-[#2845D6]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}