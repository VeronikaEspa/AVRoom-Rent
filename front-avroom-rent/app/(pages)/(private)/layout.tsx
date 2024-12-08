import React from "react";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-grayColor">
      <header className="bg-primaryColor p-4 flex justify-between items-center">
        <div className="text-white text-lg font-bold">Audiovisual Reservations</div>
        <nav className="flex space-x-4">
          <Link href="/" className="text-white text-md">Dashboard</Link>
          <Link href="/device" className="text-white text-md">Material</Link>
          <Link href="/user" className="text-white text-md">Usuarios</Link>
          <Link href="/logout" className="text-white text-md">Logout</Link>
        </nav>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 Audiovisual System</p>
      </footer>
    </div>
  );
};

export default Layout;