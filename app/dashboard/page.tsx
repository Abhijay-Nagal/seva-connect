export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">Volunteer Dashboard</h1>

        <p className="mt-4 text-gray-400">
          Your volunteer activity and registered events will appear here.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold">Registered Events</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold">Hours Volunteered</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </main>
  );
}
