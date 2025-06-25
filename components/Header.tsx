"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const ALLOWED_EMAILS = [
  "chirag.sanghvi@lilly.com",
  "neha.bansal1@lilly.com"
];

export default function Header() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const isAdmin = ALLOWED_EMAILS.includes(email || "");

  return (
    <header className="w-full bg-white flex justify-between items-center px-6 py-3 shadow-md">
      <div className="flex items-center gap-3">
        <Image src="/lilly-logo.png" alt="Lilly Logo" width={48} height={48} className="object-contain" />
      </div>

      {status !== "loading" && email && (
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span>
            Signed in as <strong>{email}</strong> ({isAdmin ? "Admin" : "User"})
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-3 py-1 bg-[#d52b1e] text-white rounded hover:bg-[#b3241a] transition"
          >
            Sign out
          </button>
        </div>
      )}
      {status !== "loading" && !email && (
        <button
          onClick={() => window.location.href = "/login"}
          className="px-3 py-1 bg-[#d52b1e] text-white rounded hover:bg-[#b3241a] transition"
        >
          Login as Admin
        </button>
      )}
    </header>
  );
}
