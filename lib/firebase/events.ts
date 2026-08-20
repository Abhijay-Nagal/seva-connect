import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "./config";

export async function getEvents() {
  const snapshot = await getDocs(collection(db, "events"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createEvent(event: {
  title: string;
  description: string;
  date: string;
  location: string;
  maxVolunteers: number;
  createdBy: string;
}) {
  return await addDoc(collection(db, "events"), {
    ...event,
    registrationCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getVolunteerRegistration(
  eventId: string,
  volunteerId: string,
) {
  const registrationsRef = collection(db, "registrations");

  const q = query(
    registrationsRef,
    where("eventId", "==", eventId),
    where("volunteerId", "==", volunteerId),
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

export async function registerForEvent(
  eventId: string,
  volunteerId: string,
) {
  const existingRegistration = await getVolunteerRegistration(
    eventId,
    volunteerId,
  );

  if (existingRegistration) {
    throw new Error("You are already registered for this event.");
  }

  return await addDoc(collection(db, "registrations"), {
    eventId,
    volunteerId,
    registeredAt: serverTimestamp(),
  });
}