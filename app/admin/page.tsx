export default function AdminPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <p className="mt-4 text-gray-400">
          Manage volunteer events and platform activity from here.
        </p>

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
