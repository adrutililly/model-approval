"use client";

import { useSession } from "next-auth/react";

const ALLOWED_EMAILS = [
  "chirag.sanghvi@lilly.com",
  "neha.bansal1@lilly.com"
];

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  const email = session?.user?.email;
  const isAdmin = email && ALLOWED_EMAILS.includes(email);

  return (
    <div>
      <div>Your email: {email}</div>
      <div>Admin: {isAdmin ? "Yes" : "No"}</div>
    </div>
  );
}
