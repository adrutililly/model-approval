import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const ALLOWED_EMAILS = [
  "chirag.sanghvi@lilly.com",
  "neha.bansal1@lilly.com"
];

export async function isEmailAllowed(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  return !!(email && ALLOWED_EMAILS.includes(email));
}
