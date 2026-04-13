"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Type for meals returned from API
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

// Type for goals returned from API
type GoalItem = {
  id?: string;
  daily_calorie_goal?: number;
  weekly_workout_goal?: number;
  target_weight?: number;
};

// Type for profile returned from API
type ProfileItem = {
  id?: string;
  full_name?: string;
  age?: number | null;
  height?: number | null;
  current_weight?: number | null;
  target_weight?: number | null;
};

// Type for weight logs returned from API
type WeightLogItem = {
  id: string;
  weight: number;
  log_date: string;
};

// Dashboard page
export default function DashboardPage() {
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [goals, setGoals] = useState<GoalItem | null>(null);
  const [profile, setProfile] = useState<ProfileItem | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLogItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Format numbers to max 2 decimal places
  function formatNumber(value: number | string) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return "-";

    return Number.isInteger(numericValue)
      ? String(numericValue)
      : numericValue.toFixed(2);
  }

  // Load dashboard data when page opens
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setErrorMessage("");

      try {
        const [mealsResponse, goalsResponse, profileResponse, weightResponse] =
          await Promise.all([
            fetch("/api/meals", { method: "GET", cache: "no-store" }),
            fetch("/api/goals", { method: "GET", cache: "no-store" }),
            fetch("/api/profile", { method: "GET", cache: "no-store" }),
            fetch("/api/weight", { method: "GET", cache: "no-store" }),
          ]);

        const mealsResult = await mealsResponse.json();
        const goalsResult = await goalsResponse.json();
        const profileResult = await profileResponse.json();
        const weightResult = await weightResponse.json();

        if (!mealsResponse.ok) {
          setErrorMessage(mealsResult.error || "Failed to load meals.");
          setLoading(false);
          return;
        }

        if (!goalsResponse.ok) {
          setErrorMessage(goalsResult.error || "Failed to load goals.");
          setLoading(false);
          return;
        }

        if (!profileResponse.ok) {
          setErrorMessage(profileResult.error || "Failed to load profile.");
          setLoading(false);
          return;
        }

        if (!weightResponse.ok) {
          setErrorMessage(weightResult.error || "Failed to load weight logs.");
          setLoading(false);
          return;
        }

        setMeals(mealsResult.meals || []);
        setGoals(goalsResult.goals || null);
        setProfile(profileResult.profile || null);
        setWeightLogs(weightResult.weightLogs || []);
      } catch (error) {
        setErrorMessage("Unexpected error while loading dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Today's date in YYYY-MM-DD format
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Get meals logged for today
  const todayMeals = useMemo(() => {
    return meals.filter((meal) => meal.meal_date === today);
  }, [meals, today]);

  // Calculate total calories for today
  const todayCalories = useMemo(() => {
    return todayMeals.reduce(
      (sum, meal) => sum + Number(meal.calories || 0),
      0
    );
  }, [todayMeals]);

  // Show only the latest 3 meals on dashboard
  const recentMeals = useMemo(() => {
    return meals.slice(0, 3);
  }, [meals]);

  // Get latest weight from weight logs
  const latestWeight = useMemo(() => {
    if (weightLogs.length > 0) {
      return weightLogs[weightLogs.length - 1]?.weight ?? "-";
    }

    if (
      profile?.current_weight !== null &&
      profile?.current_weight !== undefined
    ) {
      return profile.current_weight;
    }

    return "-";
  }, [weightLogs, profile]);

  // Simple goal progress estimate
  const goalProgress = useMemo(() => {
    const current =
      latestWeight !== "-" ? Number(latestWeight) : profile?.current_weight;
    const target = goals?.target_weight ?? profile?.target_weight;

    if (
      current === undefined ||
      current === null ||
      Number.isNaN(Number(current)) ||
      target === undefined ||
      target === null ||
      Number.isNaN(Number(target))
    ) {
      return "-";
    }

    const difference = Math.abs(Number(current) - Number(target));
    const progress = Math.max(100 - difference * 10, 0);

    return `${Math.round(progress)}%`;
  }, [latestWeight, goals, profile]);

  const summaryCards = [
    {
      label: "Today Calories",
      value: loading ? "..." : formatNumber(todayCalories),
      sub: "Calories logged today",
      color: "text-[#2845D6]",
    },
    {
      label: "Meals Today",
      value: loading ? "..." : String(todayMeals.length),
      sub: "Tracked meals today",
      color: "text-[#2845D6]",
    },
    {
      label: "Current Weight",
      value: loading
        ? "..."
        : latestWeight === "-"
          ? "-"
          : `${formatNumber(latestWeight)} kg`,
      sub: "Latest weight entry",
      color: "text-[#AD49E1]",
    },
    {
      label: "Goal Progress",
      value: loading ? "..." : goalProgress,
      sub: "Weight goal estimate",
      color: "text-[#AD49E1]",
    },
  ];

  const quickLinks = [
    {
      href: "/workouts",
      label: "Workouts",
      desc: "Manage workout templates and sessions.",
      hover: "hover:border-[#2845D6]",
    },
    {
      href: "/meals",
      label: "Meals",
      desc: "Track meals and nutrition values.",
      hover: "hover:border-[#2845D6]",
    },
    {
      href: "/progress",
      label: "Progress",
      desc: "View weight and calorie charts.",
      hover: "hover:border-[#AD49E1]",
    },
    {
      href: "/profile",
      label: "Profile",
      desc: "Manage user information and account.",
      hover: "hover:border-[#AD49E1]",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome section */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6 lg:p-8">
        <p className="text-sm font-medium text-[#2845D6]">Welcome back</p>

        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {profile?.full_name ? (
            <>
              {profile.full_name.split(" ")[0]}'s{" "}
              <span className="text-[#AD49E1]">Dashboard</span>
            </>
          ) : (
            <>
              Your <span className="text-[#AD49E1]">Fitness Dashboard</span>
            </>
          )}
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
          Track your workouts, meals, goals, and progress all in one place.
          Stay consistent and keep improving every day.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/workouts"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#2845D6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1A2CA3] sm:w-auto"
          >
            Start Workout
          </Link>

          <Link
            href="/meals"
            className="inline-flex w-full items-center justify-center rounded-xl border border-neutral-700 px-5 py-3 text-sm font-bold text-white transition hover:border-[#2845D6] hover:text-[#2845D6] sm:w-auto"
          >
            Add Meal
          </Link>

          <Link
            href="/progress"
            className="inline-flex w-full items-center justify-center rounded-xl border border-neutral-700 px-5 py-3 text-sm font-bold text-white transition hover:border-[#AD49E1] hover:text-[#AD49E1] sm:w-auto"
          >
            View Progress
          </Link>
        </div>
      </section>

      {/* Error message */}
      {errorMessage && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6"
          >
            <p className="text-sm text-neutral-400">{card.label}</p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              {card.value}
            </h2>
            <p className={`mt-2 text-sm ${card.color}`}>{card.sub}</p>
          </div>
        ))}
      </section>

      {/* Main middle content */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent meals */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6 xl:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Recent Meals
            </h2>

            <Link
              href="/meals"
              className="text-sm font-semibold text-[#2845D6] transition hover:text-[#1A2CA3]"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <p className="mt-6 text-neutral-400">Loading meals...</p>
          ) : recentMeals.length === 0 ? (
            <p className="mt-6 text-neutral-400">No meals added yet.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {recentMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="rounded-2xl border border-neutral-800 bg-black p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{meal.meal_name}</p>
                      <p className="mt-1 text-sm text-neutral-400">
                        {meal.meal_type} • {meal.meal_date}
                      </p>
                    </div>

                    <p className="font-bold text-[#AD49E1]">
                      {formatNumber(meal.calories)} cal
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals summary */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white sm:text-2xl">Goals</h2>

            <Link
              href="/goals"
              className="text-sm font-semibold text-[#2845D6] transition hover:text-[#1A2CA3]"
            >
              Edit
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-neutral-800 bg-black p-4">
              <p className="text-sm text-neutral-400">Daily Calories</p>
              <p className="mt-2 text-lg font-bold text-white sm:text-xl">
                {loading ? "..." : goals?.daily_calorie_goal ?? "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-black p-4">
              <p className="text-sm text-neutral-400">Weekly Workouts</p>
              <p className="mt-2 text-lg font-bold text-white sm:text-xl">
                {loading ? "..." : goals?.weekly_workout_goal ?? "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-black p-4">
              <p className="text-sm text-neutral-400">Target Weight</p>
              <p className="mt-2 text-lg font-bold text-white sm:text-xl">
                {loading
                  ? "..."
                  : goals?.target_weight ?? profile?.target_weight ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick navigation cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition sm:rounded-3xl sm:p-6 ${item.hover}`}
          >
            <h3 className="text-lg font-bold text-white sm:text-xl">
              {item.label}
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              {item.desc}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}