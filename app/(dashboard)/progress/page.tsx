"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

// Type for meal records returned from API
type MealItem = {
  id: string;
  meal_name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_date: string;
};

// Type for weight log records returned from API
type WeightLogItem = {
  id: string;
  weight: number;
  log_date: string;
};

// Daily calorie chart item
type CalorieChartItem = {
  date: string;
  calories: number;
};

// Weight chart item
type WeightChartItem = {
  date: string;
  weight: number;
};

// Weekly calorie chart item
type WeeklyCalorieChartItem = {
  week: string;
  calories: number;
};

// Progress page
// This page now uses API routes instead of calling Supabase directly.
// It shows summary stats, weight logging, daily calorie chart,
// weekly calorie chart, and recent weight logs.
export default function ProgressPage() {
  // Data state
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLogItem[]>([]);

  // UI state
  const [showWeightLogsList, setShowWeightLogsList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  // Weight form state
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [weightValue, setWeightValue] = useState("");
  const [weightDate, setWeightDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [savingWeight, setSavingWeight] = useState(false);

  // Load all progress data once
  useEffect(() => {
    loadProgressData();
  }, []);

  // Load meals and weight logs through API routes
  async function loadProgressData() {
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const [mealsResponse, weightResponse] = await Promise.all([
        fetch("/api/meals", {
          method: "GET",
          cache: "no-store",
        }),
        fetch("/api/weight", {
          method: "GET",
          cache: "no-store",
        }),
      ]);

      const mealsResult = await mealsResponse.json();
      const weightResult = await weightResponse.json();

      if (!mealsResponse.ok) {
        setErrorMessage(mealsResult.error || "Failed to load meals.");
        setLoading(false);
        return;
      }

      if (!weightResponse.ok) {
        setErrorMessage(weightResult.error || "Failed to load weight logs.");
        setLoading(false);
        return;
      }

      setMeals(mealsResult.meals || []);
      setWeightLogs(weightResult.weightLogs || []);
    } catch (error) {
      setErrorMessage("Unexpected error while loading progress data.");
    } finally {
      setLoading(false);
    }
  }

  // Reset weight form fields
  function resetWeightForm() {
    setWeightValue("");
    setWeightDate(new Date().toISOString().split("T")[0]);
  }

  // Save weight log through API route
  async function handleSaveWeight(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingWeight(true);
    setErrorMessage("");
    setMessage("");

    if (!weightValue.trim() || !weightDate.trim()) {
      setErrorMessage("Please fill weight and date first.");
      setSavingWeight(false);
      return;
    }

    try {
      const response = await fetch("/api/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: Number(weightValue),
          log_date: weightDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to save weight log.");
        setSavingWeight(false);
        return;
      }

      resetWeightForm();
      setShowWeightForm(false);
      setMessage("Weight log saved successfully.");
      await loadProgressData();
    } catch (error) {
      setErrorMessage("Unexpected error while saving weight log.");
    } finally {
      setSavingWeight(false);
    }
  }

  // Build daily calorie chart data grouped by date
  const calorieChartData = useMemo<CalorieChartItem[]>(() => {
    const grouped: Record<string, number> = {};

    meals.forEach((meal) => {
      grouped[meal.meal_date] =
        (grouped[meal.meal_date] || 0) + Number(meal.calories || 0);
    });

    return Object.entries(grouped).map(([date, calories]) => ({
      date,
      calories,
    }));
  }, [meals]);

  // Build weight chart data
  const weightChartData = useMemo<WeightChartItem[]>(() => {
    return weightLogs.map((log) => ({
      date: log.log_date,
      weight: Number(log.weight || 0),
    }));
  }, [weightLogs]);

  // Build weekly calorie totals
  const weeklyCalorieChartData = useMemo<WeeklyCalorieChartItem[]>(() => {
    const grouped: Record<string, number> = {};

    meals.forEach((meal) => {
      const date = new Date(meal.meal_date);
      const firstDay = new Date(date);
      const day = firstDay.getDay();
      const diff = firstDay.getDate() - day + (day === 0 ? -6 : 1);
      firstDay.setDate(diff);

      const weekKey = firstDay.toISOString().split("T")[0];

      grouped[weekKey] =
        (grouped[weekKey] || 0) + Number(meal.calories || 0);
    });

    return Object.entries(grouped).map(([week, calories]) => ({
      week,
      calories,
    }));
  }, [meals]);

  // Latest weight for summary card
  const latestWeight = useMemo(() => {
    return weightLogs.length === 0
      ? "-"
      : weightLogs[weightLogs.length - 1]?.weight ?? "-";
  }, [weightLogs]);

  // Average daily calories for summary card
  const averageCalories = useMemo(() => {
    if (calorieChartData.length === 0) return 0;

    const total = calorieChartData.reduce(
      (sum, item) => sum + Number(item.calories || 0),
      0
    );

    return Math.round(total / calorieChartData.length);
  }, [calorieChartData]);

  return (
    <div>
      {/* Page heading */}
      <h1 className="text-3xl font-bold sm:text-4xl">
        Progress <span className="text-[#AD49E1]">Charts</span>
      </h1>
      <p className="mt-2 text-sm text-neutral-400 sm:mt-3 sm:text-base">
        Visualize calories and weight changes over time.
      </p>

      {/* Error message */}
      {errorMessage && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:mt-6">
          {errorMessage}
        </p>
      )}

      {/* Success message */}
      {message && (
        <p className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 sm:mt-6">
          {message}
        </p>
      )}

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">
        {[
          { label: "Latest Weight", value: latestWeight },
          { label: "Avg Daily Calories", value: averageCalories },
          { label: "Total Meal Entries", value: meals.length },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6"
          >
            <h2 className="text-sm font-semibold text-[#2845D6] sm:text-lg">
              {card.label}
            </h2>
            <p className="mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Weight log form */}
      {showWeightForm && (
        <form
          onSubmit={handleSaveWeight}
          className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:mt-8 sm:rounded-3xl sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Add Weight Log
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowWeightForm(false);
                resetWeightForm();
                setErrorMessage("");
              }}
              className="rounded-xl border border-neutral-700 px-5 py-2 font-semibold text-white transition hover:border-[#2845D6] hover:text-[#2845D6]"
            >
              Cancel
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Weight
              </label>
              <input
                type="number"
                step="0.1"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                placeholder="e.g. 78.5"
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Date
              </label>
              <input
                type="date"
                value={weightDate}
                onChange={(e) => setWeightDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingWeight}
            className="mt-5 w-full rounded-xl bg-[#2845D6] px-6 py-3 font-bold text-white transition hover:bg-[#1A2CA3] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-6 sm:w-auto"
          >
            {savingWeight ? "Saving..." : "Save Weight"}
          </button>
        </form>
      )}

      {/* Weight chart */}
      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:mt-8 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Weight Progress Chart
          </h2>

          <button
            onClick={() => {
              setShowWeightForm(true);
              setMessage("");
              setErrorMessage("");
            }}
            className="w-full rounded-xl bg-[#2845D6] px-5 py-2.5 font-bold text-white transition hover:bg-[#1A2CA3] sm:w-auto"
          >
            Add Weight
          </button>
        </div>

        {loading ? (
          <p className="mt-6 text-neutral-400">Loading chart...</p>
        ) : weightChartData.length === 0 ? (
          <p className="mt-6 text-neutral-400">
            No weight logs available yet.
          </p>
        ) : (
          <div className="mt-6 h-[240px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightChartData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2733",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#AD49E1"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent weight logs */}
      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:mt-8 sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Recent Weight Logs
          </h2>

          <button
            type="button"
            onClick={() => setShowWeightLogsList((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-700 bg-black text-white transition hover:border-[#2845D6] hover:text-[#2845D6] sm:h-10 sm:w-10"
          >
            {showWeightLogsList ? "▾" : "▸"}
          </button>
        </div>

        {!showWeightLogsList ? (
          <p className="mt-4 text-neutral-400 sm:mt-6">
            Weight log list is hidden.
          </p>
        ) : weightLogs.length === 0 ? (
          <p className="mt-4 text-neutral-400 sm:mt-6">
            No weight logs added yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
            {[...weightLogs]
              .reverse()
              .slice(0, 5)
              .map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-neutral-800 bg-black p-3 sm:rounded-2xl sm:p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white sm:text-base">
                      {log.log_date}
                    </p>
                    <p className="text-sm font-bold text-[#AD49E1] sm:text-base">
                      {log.weight}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Daily calories chart */}
      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:mt-8 sm:rounded-3xl sm:p-6">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Daily Calories Chart
        </h2>

        {loading ? (
          <p className="mt-6 text-neutral-400">Loading chart...</p>
        ) : calorieChartData.length === 0 ? (
          <p className="mt-6 text-neutral-400">
            No meal data available yet.
          </p>
        ) : (
          <div className="mt-6 h-[240px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calorieChartData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2733",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#2845D6"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Weekly calories chart */}
      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:mt-8 sm:rounded-3xl sm:p-6">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Weekly Calories Chart
        </h2>

        {loading ? (
          <p className="mt-6 text-neutral-400">Loading chart...</p>
        ) : weeklyCalorieChartData.length === 0 ? (
          <p className="mt-6 text-neutral-400">
            No weekly meal data available yet.
          </p>
        ) : (
          <div className="mt-6 h-[240px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCalorieChartData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2733",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="calories" fill="#49a8ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}