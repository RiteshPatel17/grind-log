"use client";

import { useEffect, useState } from "react";

// Profile page
// This page now uses API routes instead of calling Supabase directly.
export default function ProfilePage() {
  // Form state
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  // Original loaded profile values
  const [originalProfile, setOriginalProfile] = useState<{
    full_name: string;
    age: string;
    height: string;
    current_weight: string;
    target_weight: string;
  } | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load profile on page open
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setErrorMessage("");
      setMessage("");

      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          setErrorMessage(result.error || "Failed to load profile.");
          setLoading(false);
          return;
        }

        const data = result.profile;

        if (data) {
          const loadedProfile = {
            full_name: data.full_name ?? "",
            age: data.age ? String(data.age) : "",
            height: data.height ? String(data.height) : "",
            current_weight: data.current_weight
              ? String(data.current_weight)
              : "",
            target_weight: data.target_weight ? String(data.target_weight) : "",
          };

          setFullName(loadedProfile.full_name);
          setAge(loadedProfile.age);
          setHeight(loadedProfile.height);
          setCurrentWeight(loadedProfile.current_weight);
          setTargetWeight(loadedProfile.target_weight);

          setOriginalProfile(loadedProfile);
        }
      } catch (error) {
        setErrorMessage("Unexpected error while loading profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Save profile through API route
  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setMessage("");

    const currentProfile = {
      full_name: fullName.trim(),
      age: age.trim(),
      height: height.trim(),
      current_weight: currentWeight.trim(),
      target_weight: targetWeight.trim(),
    };

    // If nothing changed, do not save again
    if (
      originalProfile &&
      Object.keys(currentProfile).every(
        (key) =>
          currentProfile[key as keyof typeof currentProfile] ===
          originalProfile[key as keyof typeof originalProfile]
      )
    ) {
      setMessage("No changes to save.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: currentProfile.full_name,
          age: currentProfile.age,
          height: currentProfile.height,
          current_weight: currentProfile.current_weight,
          target_weight: currentProfile.target_weight,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Failed to save profile.");
        setSaving(false);
        return;
      }

      setOriginalProfile(currentProfile);
      setMessage(result.message || "Profile saved successfully.");
    } catch (error) {
      setErrorMessage("Unexpected error while saving profile.");
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Your <span className="text-[#AD49E1]">Profile</span>
        </h1>
        <p className="mt-4 text-neutral-400 sm:mt-6">Loading profile...</p>
      </div>
    );
  }

  const fields = [
    {
      label: "Full Name",
      type: "text",
      value: fullName,
      setter: setFullName,
      placeholder: "Enter your full name",
      step: undefined,
    },
    {
      label: "Age",
      type: "number",
      value: age,
      setter: setAge,
      placeholder: "Enter your age",
      step: undefined,
    },
    {
      label: "Height (cm)",
      type: "number",
      value: height,
      setter: setHeight,
      placeholder: "Enter your height",
      step: "0.1",
    },
    {
      label: "Current Weight (kg)",
      type: "number",
      value: currentWeight,
      setter: setCurrentWeight,
      placeholder: "Enter your current weight",
      step: "0.1",
    },
    {
      label: "Target Weight (kg)",
      type: "number",
      value: targetWeight,
      setter: setTargetWeight,
      placeholder: "Enter your target weight",
      step: "0.1",
    },
  ];

  return (
    <div>
      {/* Page heading */}
      <h1 className="text-3xl font-bold sm:text-4xl">
        Your <span className="text-[#AD49E1]">Profile</span>
      </h1>
      <p className="mt-2 text-sm text-neutral-400 sm:mt-3 sm:text-base">
        Manage your account and personal fitness details here.
      </p>

      {/* Profile form */}
      <form
        onSubmit={handleSave}
        className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:mt-8 sm:rounded-3xl sm:p-6"
      >
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                {field.label}
              </label>
              <input
                type={field.type}
                step={field.step}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
              />
            </div>
          ))}
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:mt-5">
            {errorMessage}
          </p>
        )}

        {/* Success/info message */}
        {message && (
          <p className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 sm:mt-5">
            {message}
          </p>
        )}

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="mt-5 w-full rounded-xl bg-[#2845D6] px-6 py-3 font-bold text-white transition hover:bg-[#1A2CA3] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-6 sm:w-auto"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}