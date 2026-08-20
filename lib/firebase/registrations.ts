import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./config";

export async function getEventRegistrationCount(eventId: string) {
  const registrationsQuery = query(
    collection(db, "registrations"),
    where("eventId", "==", eventId),
  );

  const snapshot = await getDocs(registrationsQuery);

  return snapshot.size;
}

export async function isAlreadyRegistered(
  eventId: string,
  volunteerId: string,
) {
  const registrationsQuery = query(
    collection(db, "registrations"),
    where("eventId", "==", eventId),
    where("volunteerId", "==", volunteerId),
  );

  const snapshot = await getDocs(registrationsQuery);

  return !snapshot.empty;
}

export async function registerForEvent(
  eventId: string,
  volunteerId: string,
) {
  return await addDoc(collection(db, "registrations"), {
    eventId,
    volunteerId,
    registeredAt: serverTimestamp(),
  });
}