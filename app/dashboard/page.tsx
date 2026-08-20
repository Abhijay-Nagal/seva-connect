"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/lib/firebase/config";
import type { Event } from "@/types/event";

type Registration = {
  id: string;
  eventId: string;
  volunteerId: string;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) {
        return;
      }

      try {
        setDataLoading(true);
        setError("");

        // Get registrations belonging to the current volunteer
        const registrationsQuery = query(
          collection(db, "registrations"),
          where("volunteerId", "==", user.uid),
        );

        const registrationsSnapshot = await getDocs(registrationsQuery);

        const userRegistrations = registrationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Registration[];

        setRegistrations(userRegistrations);

        // Get all events
        const eventsSnapshot = await getDocs(collection(db, "events"));

        const allEvents = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];

        // Only keep events the user registered for
        const registeredEvents = allEvents.filter((event) =>
          userRegistrations.some(
            (registration) => registration.eventId === event.id,
          ),
        );

        setEvents(registeredEvents);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setError("Unable to load dashboard data.");
      } finally {
        setDataLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  if (loading || dataLoading) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter(
    (event) => event.date >= today,
  );

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">Volunteer Dashboard</h1>

        <p className="mt-4 text-gray-400">
          Your volunteer activity and registered events will appear here.
        </p>

        {error && (
          <p className="mt-6 text-red-500">
            {error}
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold">
              Registered Events
            </h2>

            <p className="mt-2 text-3xl font-bold">
              {registrations.length}
            </p>
          </div>

          <div className="rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold">
              Upcoming Events
            </h2>

            <p className="mt-2 text-3xl font-bold">
              {upcomingEvents.length}
            </p>
          </div>

          <div className="rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold">
              Hours Volunteered
            </h2>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>
        </div>
      </div>
              <section className="mt-10">
          <h2 className="text-2xl font-bold">My Registered Events</h2>

          {events.length === 0 ? (
            <p className="mt-4 text-gray-400">
              You haven&apos;t registered for any events yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-gray-800 p-6"
                >
                  <h3 className="text-xl font-semibold">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-gray-400">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <strong>Date:</strong> {event.date}
                    </p>

                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/events/${event.id}`)
                    }
                    className="mt-5 rounded-md bg-white px-4 py-2 font-semibold text-black transition hover:bg-gray-200"
                  >
                    View Event
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
    </main>
  );
}