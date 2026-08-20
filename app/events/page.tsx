"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import { Event } from "@/types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("date", "asc")
        );

        const snapshot = await getDocs(eventsQuery);

        const eventList: Event[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));

        setEvents(eventList);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="mt-4 text-gray-400">Loading events...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="mt-4 text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Available Events</h1>

        <p className="mt-4 text-gray-400">
          Browse upcoming volunteer opportunities.
        </p>

        {events.length === 0 ? (
          <p className="mt-10 text-gray-400">
            No events are available right now.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-gray-800 p-6"
              >
                <h2 className="text-xl font-semibold">{event.title}</h2>

                <p className="mt-3 text-gray-400">{event.description}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-400">
                  <p>
                    <strong className="text-white">Date:</strong>{" "}
                    {event.date}
                  </p>

                  <p>
                    <strong className="text-white">Location:</strong>{" "}
                    {event.location}
                  </p>

                  <p>
                    <strong className="text-white">Maximum Volunteers:</strong>{" "}
                    {event.maxVolunteers}
                  </p>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="mt-6 inline-block rounded-lg bg-white px-5 py-2 font-semibold text-black transition hover:bg-gray-200"
                >
                  View Event
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}