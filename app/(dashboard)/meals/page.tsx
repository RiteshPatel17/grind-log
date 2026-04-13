"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Type for saved meal records from Supabase
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

// Type for Open Food Facts search results
type OpenFoodFactsProduct = {
  code?: string;
  product_name?: string;
  brands?: string;
  image_front_small_url?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
};

// Meals page
// This page lets the user:
// 1. View daily nutrition totals
// 2. Add meals manually
// 3. Search foods using Open Food Facts
// 4. Collapse search after selecting a product
// 5. Save meals to Supabase
// 6. View and delete saved meals
export default function MealsPage() {
  const supabase = createClient();

  // Manual meal form state
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [mealDate, setMealDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Page state
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Open Food Facts search state
  const [foodSearch, setFoodSearch] = useState("");
  const [searchingFoods, setSearchingFoods] = useState(false);
  const [foodResults, setFoodResults] = useState<OpenFoodFactsProduct[]>([]);
  const [selectedFood, setSelectedFood] = useState<OpenFoodFactsProduct | null>(
    null
  );
  const [showFoodSearch, setShowFoodSearch] = useState(true);

  function formatNumber(value: number | string) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return "-";

  return Number.isInteger(numericValue)
    ? String(numericValue)
    : numericValue.toFixed(2);
  }

  // Load meals when page opens
  useEffect(() => {
    loadMeals();
  }, []);

  // Load all meals for the logged-in user
  async function loadMeals() {
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("Unable to find logged-in user.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", user.id)
      .order("meal_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setMeals((data as MealItem[]) || []);
    setLoading(false);
  }

  // Reset all form fields after save or cancel
  function resetMealForm() {
    setMealName("");
    setMealType("Breakfast");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setMealDate(new Date().toISOString().split("T")[0]);

    setFoodSearch("");
    setFoodResults([]);
    setSelectedFood(null);
    setShowFoodSearch(true);
  }

  // Save one meal to Supabase
  async function handleSaveMeal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("Unable to find logged-in user.");
      setSaving(false);
      return;
    }

    // Validation
    if (
      !mealName.trim() ||
      !mealType.trim() ||
      !calories.trim() ||
      !protein.trim() ||
      !carbs.trim() ||
      !fat.trim() ||
      !mealDate.trim()
    ) {
      setErrorMessage("Please fill all meal fields first.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("meals").insert({
      user_id: user.id,
      meal_name: mealName.trim(),
      meal_type: mealType,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      meal_date: mealDate,
    });

    if (error) {
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    resetMealForm();
    setShowAddMealForm(false);
    setMessage("Meal saved successfully.");
    setSaving(false);

    await loadMeals();
  }

  // Delete a meal by id
  async function handleDeleteMeal(mealId: string) {
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase.from("meals").delete().eq("id", mealId);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Meal deleted successfully.");
    await loadMeals();
  }

  // Search foods from Open Food Facts
  async function handleFoodSearch() {
    if (!foodSearch.trim()) {
      setErrorMessage("Enter a food name first.");
      return;
    }

    setSearchingFoods(true);
    setErrorMessage("");
    setMessage("");

    try {
      const url =
        `https://world.openfoodfacts.org/cgi/search.pl?` +
        new URLSearchParams({
          search_terms: foodSearch.trim(),
          search_simple: "1",
          action: "process",
          json: "1",
          page_size: "12",
          fields:
            "product_name,brands,image_front_small_url,nutriments,code",
        }).toString();

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to search foods.");
      }

      const data = await response.json();
      const results = Array.isArray(data.products) ? data.products : [];
      setFoodResults(results);

      if (results.length === 0) {
        setMessage("No food results found.");
      }
    } catch {
      setErrorMessage("Unable to search Open Food Facts right now.");
    } finally {
      setSearchingFoods(false);
    }
  }

  // Select one food and collapse search section
  function handleSelectFood(product: OpenFoodFactsProduct) {
    setSelectedFood(product);

    setMealName(product.product_name || "Selected Food");
    setCalories(
      product.nutriments?.["energy-kcal_100g"] !== undefined
        ? String(product.nutriments["energy-kcal_100g"])
        : ""
    );
    setProtein(
      product.nutriments?.proteins_100g !== undefined
        ? String(product.nutriments.proteins_100g)
        : ""
    );
    setCarbs(
      product.nutriments?.carbohydrates_100g !== undefined
        ? String(product.nutriments.carbohydrates_100g)
        : ""
    );
    setFat(
      product.nutriments?.fat_100g !== undefined
        ? String(product.nutriments.fat_100g)
        : ""
    );

    // Collapse search area after choosing a product
    setShowFoodSearch(false);
    setMessage("Food selected. You can review and save it now.");
  }

  // Go back to the search panel and choose a different product
  function handleBackToSearch() {
    setSelectedFood(null);
    setShowFoodSearch(true);
    setMessage("");
  }

  // Meals filtered by selected date
  const todayMeals = useMemo(() => {
    return meals.filter((meal) => meal.meal_date === mealDate);
  }, [meals, mealDate]);

  // Nutrition totals for selected date
  const totals = useMemo(() => {
    return todayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + Number(meal.calories || 0),
        protein: acc.protein + Number(meal.protein || 0),
        carbs: acc.carbs + Number(meal.carbs || 0),
        fat: acc.fat + Number(meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [todayMeals]);

  return (
    <div>
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Meal <span className="text-[#AD49E1]">Tracking</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-400 sm:mt-3 sm:text-base">
            Search foods with Open Food Facts and log your meals here.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddMealForm(true);
            setMessage("");
            setErrorMessage("");
          }}
          className="w-full rounded-xl bg-[#2845D6] px-6 py-3 font-bold text-white transition hover:bg-[#1A2CA3] sm:w-auto"
        >
          Add Meal
        </button>
      </div>

      {/* Totals cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-6 md:grid-cols-4">
        {[
          { label: "Calories", value: totals.calories, unit: "" },
          { label: "Protein", value: totals.protein, unit: " g" },
          { label: "Carbs", value: totals.carbs, unit: " g" },
          { label: "Fat", value: totals.fat, unit: " g" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:rounded-3xl sm:p-6"
          >
            <h2 className="text-sm font-semibold text-[#2845D6] sm:text-lg">
              {item.label}
            </h2>
            <p className="mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl">
              {formatNumber(item.value)}
              {item.unit}
            </p>
          </div>
        ))}
      </div>

      {/* Error message */}
      {errorMessage && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:mt-6">
          {errorMessage}
        </p>
      )}

      {/* Success/info message */}
      {message && (
        <p className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 sm:mt-6">
          {message}
        </p>
      )}

      {/* Add meal form */}
      {showAddMealForm && (
        <form
          onSubmit={handleSaveMeal}
          className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:mt-8 sm:rounded-3xl sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Add Meal
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowAddMealForm(false);
                resetMealForm();
                setErrorMessage("");
              }}
              className="rounded-xl border border-neutral-700 px-5 py-2 font-semibold text-white transition hover:border-[#2845D6] hover:text-[#2845D6]"
            >
              Cancel
            </button>
          </div>

          {/* Search section only shows before product selection */}
          {showFoodSearch && (
            <div className="mt-5 rounded-2xl border border-neutral-800 bg-black p-4 sm:p-5">
              <h3 className="text-base font-semibold text-white sm:text-lg">
                Search with Open Food Facts
              </h3>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleFoodSearch();
                    }
                  }}
                  placeholder="Search food name e.g. oats, milk"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                />

                <button
                  type="button"
                  onClick={handleFoodSearch}
                  disabled={searchingFoods}
                  className="w-full rounded-xl bg-[#2845D6] px-6 py-3 font-bold text-white transition hover:bg-[#1A2CA3] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {searchingFoods ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Search results */}
              {foodResults.length > 0 && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {foodResults.map((product, index) => (
                    <div
                      key={`${product.code || product.product_name || "food"}-${index}`}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
                    >
                      <div className="flex gap-3">
                        {product.image_front_small_url ? (
                          <img
                            src={product.image_front_small_url}
                            alt={product.product_name || "Food"}
                            className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-xs text-neutral-400 sm:h-20 sm:w-20">
                            No Image
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold text-white sm:text-base">
                            {product.product_name || "Unnamed Product"}
                          </h4>
                          <p className="mt-1 truncate text-xs text-neutral-400">
                            {product.brands || "Unknown brand"}
                          </p>

                          <div className="mt-2 text-xs text-neutral-300">
                            <p>
                              Cal:{" "}
                              {product.nutriments?.["energy-kcal_100g"] ?? "-"}
                            </p>
                            <p>
                              Protein: {product.nutriments?.proteins_100g ?? "-"}g
                            </p>
                            <p>
                              Carbs:{" "}
                              {product.nutriments?.carbohydrates_100g ?? "-"}g
                            </p>
                            <p>Fat: {product.nutriments?.fat_100g ?? "-"}g</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectFood(product)}
                            className="mt-3 rounded-xl bg-[#2845D6]/15 px-3 py-1.5 text-xs font-semibold text-[#2845D6] transition hover:bg-[#2845D6]/25 sm:px-4 sm:py-2 sm:text-sm"
                          >
                            Use This Food
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected food summary shows after choosing a product */}
          {selectedFood && !showFoodSearch && (
            <div className="mt-5 rounded-2xl border border-neutral-800 bg-black p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  {selectedFood.image_front_small_url ? (
                    <img
                      src={selectedFood.image_front_small_url}
                      alt={selectedFood.product_name || "Selected food"}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-xs text-neutral-400 sm:h-20 sm:w-20">
                      No Image
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-white sm:text-lg">
                      {selectedFood.product_name || "Selected Food"}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-400">
                      {selectedFood.brands || "Unknown brand"}
                    </p>

                    <div className="mt-2 text-xs text-neutral-300">
                      <p>Calories: {calories || "-"}</p>
                      <p>Protein: {protein || "-"} g</p>
                      <p>Carbs: {carbs || "-"} g</p>
                      <p>Fat: {fat || "-"} g</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBackToSearch}
                  className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#2845D6] hover:text-[#2845D6]"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Manual details form */}
          <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2">
            {[
              {
                label: "Meal Name",
                type: "text",
                value: mealName,
                setter: setMealName,
                placeholder: "e.g. Chicken and rice",
              },
              {
                label: "Calories",
                type: "number",
                value: calories,
                setter: setCalories,
                placeholder: "e.g. 550",
              },
              {
                label: "Protein (g)",
                type: "number",
                value: protein,
                setter: setProtein,
                placeholder: "e.g. 35",
              },
              {
                label: "Carbs (g)",
                type: "number",
                value: carbs,
                setter: setCarbs,
                placeholder: "e.g. 50",
              },
              {
                label: "Fat (g)",
                type: "number",
                value: fat,
                setter: setFat,
                placeholder: "e.g. 12",
              },
            ].map((field) => (
              <div key={field.label}>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
                />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
              >
                {["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Meal Date
              </label>
              <input
                type="date"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
              />
            </div>
          </div>

          {/* Save meal button */}
          <button
            type="submit"
            disabled={saving}
            className="mt-5 w-full rounded-xl bg-[#2845D6] px-6 py-3 font-bold text-white transition hover:bg-[#1A2CA3] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-6 sm:w-auto"
          >
            {saving ? "Saving..." : "Save Meal"}
          </button>
        </form>
      )}

      {/* Meal history */}
      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:mt-8 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Meal History
          </h2>
          <p className="text-xs text-neutral-400 sm:text-sm">
            Date: {mealDate}
          </p>
        </div>

        {loading ? (
          <p className="mt-6 text-neutral-400">Loading meals...</p>
        ) : todayMeals.length === 0 ? (
          <p className="mt-6 text-neutral-400">
            No meals added for this date yet.
          </p>
        ) : (
          <div className="mt-5 space-y-4 sm:mt-6">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-xl border border-neutral-800 bg-black p-4 sm:rounded-2xl sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white sm:text-xl">
                      {meal.meal_name}
                    </h3>
                    <p className="mt-1 text-sm text-[#AD49E1]">
                      {meal.meal_type}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                      Date: {meal.meal_date}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="shrink-0 rounded-xl border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                  { label: "Calories", value: `${formatNumber(meal.calories)}` },
                  { label: "Protein", value: `${formatNumber(meal.protein)} g` },
                  { label: "Carbs", value: `${formatNumber(meal.carbs)} g` },
                  { label: "Fat", value: `${formatNumber(meal.fat)} g` },
                 ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-neutral-800 bg-neutral-900 p-3 sm:p-4"
                    >
                      <p className="text-xs text-neutral-400 sm:text-sm">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-base font-bold text-white sm:mt-2 sm:text-xl">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}