"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { createEvent } from "@/lib/firebase/events";

export default function AdminPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!user || role !== "admin") {
    return null;
  }

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (
      !title ||
      !description ||
      !date ||
      !location ||
      !maxVolunteers
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    const volunteerLimit = Number(maxVolunteers);

    if (!Number.isInteger(volunteerLimit) || volunteerLimit <= 0) {
      setMessage("Maximum volunteers must be a positive whole number.");
      return;
    }

    try {
      setSubmitting(true);

      await createEvent({
        title,
        description,
        date,
        location,
        maxVolunteers: volunteerLimit,
        createdBy: user.uid,
      });

      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setMaxVolunteers("");
      setMessage("Event created successfully.");
    } catch (error) {
      console.error("Failed to create event:", error);
      setMessage("Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <p className="mt-4 text-gray-400">
          Manage volunteer events and platform activity from here.
        </p>

        <section className="mt-10 rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-semibold">Create Event</h2>

          <form onSubmit={handleCreateEvent} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium">
                Event Name
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-700 bg-transparent px-4 py-2"
                placeholder="Tree Plantation Drive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-700 bg-transparent px-4 py-2"
                rows={4}
                placeholder="Help plant trees around the community park."
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Date</label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-700 bg-transparent px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Location</label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-700 bg-transparent px-4 py-2"
                placeholder="Patiala Community Park"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Maximum Volunteers
              </label>

              <input
                type="number"
                min="1"
                value={maxVolunteers}
                onChange={(e) => setMaxVolunteers(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-700 bg-transparent px-4 py-2"
                placeholder="30"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-white px-5 py-2 font-semibold text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Event"}
            </button>

            {message && (
              <p className="text-sm text-gray-400">{message}</p>
            )}
          </form>
        </section>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold">Total Events</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold">Volunteers</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold">Registrations</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </main>
  );
}