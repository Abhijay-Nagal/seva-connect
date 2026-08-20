# SevaConnect

SevaConnect is a simple NGO volunteer coordination platform.

## MVP

The MVP will allow:

- Volunteers to sign up and log in
- Volunteers to view available NGO events
- Volunteers to register for events
- Admins to create and manage events

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore

## Architecture

The application uses a Next.js frontend connected directly to Firebase services.

```text
Browser
   |
   v
Next.js
   |
   +---- Firebase Authentication
   |
   +---- Firestore
```
