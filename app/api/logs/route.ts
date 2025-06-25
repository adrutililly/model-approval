import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ALLOWED_EMAILS } from "@/lib/auth-middleware";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = ALLOWED_EMAILS.includes(session.user.email);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { modelId, legal, cyber, procurement, comments } = await req.json();

    if (!modelId) {
      return NextResponse.json({ error: "Model ID is required" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO user_info (id, emp_id, first_name, last_name, email_id, legal, cyber, procurement, comments)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          modelId,
          session.user.empId,
          session.user.firstName,
          session.user.lastName,
          session.user.email,
          legal || "NaN",
          cyber || "NaN",
          procurement || "NaN",
          typeof comments !== 'undefined' ? comments : ''
        ]
      );

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error logging update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 