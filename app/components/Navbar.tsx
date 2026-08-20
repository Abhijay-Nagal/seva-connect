import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          SevaConnect
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>

          <Link href="/events" className="text-gray-300 hover:text-white">
            Events
          </Link>

          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>

          <Link href="/admin" className="text-gray-300 hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}