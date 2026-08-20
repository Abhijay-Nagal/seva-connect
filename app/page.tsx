export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Serve. Connect. Make a Difference.
          </h1>

          <p className="mt-6 text-lg text-gray-400 sm:text-xl">
            SevaConnect helps volunteers discover meaningful opportunities
            and connect with their community.
          </p>

          <a
            href="/events"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            View Events
          </a>
        </div>
      </section>
    </main>
  );
}