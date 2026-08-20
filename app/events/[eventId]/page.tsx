"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { auth } from "@/lib/firebase/config";
import { registerForEvent } from "@/lib/firebase/registrations";
import type { Event } from "@/types/event";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        const eventRef = doc(db, "events", eventId);
        const snapshot = await getDoc(eventRef);

        if (!snapshot.exists()) {
          setError("Event not found.");
          return;
        }

        setEvent({
          id: snapshot.id,
          ...snapshot.data(),
        } as Event);

        const registrationsQuery = query(
          collection(db, "registrations"),
          where("eventId", "==", eventId),
        );

        const registrationsSnapshot = await getDocs(registrationsQuery);

        setRegistrationCount(registrationsSnapshot.size);

        const currentUser = auth.currentUser;

        if (currentUser) {
          const userRegistrationQuery = query(
            collection(db, "registrations"),
            where("eventId", "==", eventId),
            where("volunteerId", "==", currentUser.uid),
          );

          const userRegistrationSnapshot = await getDocs(
            userRegistrationQuery,
          );

          setAlreadyRegistered(!userRegistrationSnapshot.empty);
        }
      } catch (error) {
        console.error("Failed to load event:", error);
        setError("Unable to load event.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  async function handleRegister() {
    setError("");
    setSuccess("");

    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError("Please log in to register for this event.");
      return;
    }

    if (!event) {
      return;
    }

    if (alreadyRegistered) {
      setError("You are already registered for this event.");
      return;
    }

    if (registrationCount >= event.maxVolunteers) {
      setError("This event is full.");
      return;
    }

    try {
      setRegistering(true);

      await registerForEvent(eventId, currentUser.uid);

      setRegistrationCount((count) => count + 1);
      setAlreadyRegistered(true);
      setSuccess("Successfully registered for this event.");
    } catch (error) {
      console.error("Registration failed:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to register for this event.");
      }
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p>Loading event...</p>
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Event</h1>
        <p className="mt-4 text-red-500">{error}</p>
      </main>
    );
  }

  if (!event) {
    return null;
  }

  const eventFull = registrationCount >= event.maxVolunteers;

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">{event.title}</h1>

        <p className="mt-6 text-gray-400">{event.description}</p>

        <div className="mt-8 space-y-3">
          <p>
            <strong>Date:</strong> {event.date}
          </p>

          <p>
            <strong>Location:</strong> {event.location}
          </p>

          <p>
            <strong>Volunteers:</strong> {registrationCount} /{" "}
            {event.maxVolunteers}
          </p>
        </div>

        <button
          onClick={handleRegister}
          disabled={registering || alreadyRegistered || eventFull}
          className="mt-8 rounded-md bg-white px-5 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-white"
        >
          {registering
            ? "Registering..."
            : alreadyRegistered
              ? "Already Registered"
              : eventFull
                ? "Event Full"
                : "Register"}
        </button>

        {success && (
          <p className="mt-4 text-green-500">
            {success}
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-500">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}