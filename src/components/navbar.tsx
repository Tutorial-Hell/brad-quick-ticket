import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <Link href="/" className="text-xl font-bold text-blue-600">
          QuickTicket
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/ticket/new"
          className="hover:underline text-gray-700 transition"
        >
          New Ticket
        </Link>
        <Link
          href="/tickets"
          className="hover:underline text-gray-700 transition"
        >
          My Tickets
        </Link>
        <Link
          href="/logout"
          className="hover:underline text-gray-700 transition"
        >
          Logout
        </Link>
        <Link
          href="/login"
          className="hover:underline text-gray-700 transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="hover:underline text-gray-700 transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
