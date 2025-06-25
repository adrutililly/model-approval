import { NextResponse, NextRequest } from 'next/server';
import { Pool } from 'pg';
import * as z from 'zod';
import { ALLOWED_EMAILS } from '@/lib/auth-middleware';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const formSchema = z.object({
  modelName: z.string().min(1, 'Model name is required'),
  version: z.string().min(1, 'Version is required'),
  category: z.string().min(1, 'Category is required'),
  infrastructure: z.string().min(1, 'Infrastructure is required'),
  license: z.string().min(1, 'License is required'),
  confirmation: z.boolean().refine((val) => val === true, {
    message: 'You must confirm this statement',
  }),
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        model_name,
        version,
        category,
        infra,
        license,
        legal_status,
        cyber_status,
        procurement_status,
        comments
      FROM newmodel_request
      ORDER BY id ASC
    `);

    // Map DB columns to frontend keys
    const data = result.rows.map((row: any) => ({
      id: row.id,
      model: row.model_name,
      version: row.version,
      category: row.category,
      legal: row.legal_status,
      cyber: row.cyber_status,
      procurement: row.procurement_status,
      infrastructure: row.infra,
      license: row.license,
      comments: row.comments,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = formSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    const { modelName, version, category, infrastructure, license } = parsed.data;
    // Insert into DB
    await pool.query(
      `INSERT INTO newmodel_request (model_name, version, category, infra, license, legal_status, cyber_status, procurement_status, comments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [modelName, version, category, infrastructure, license, 'submitted', 'submitted', 'submitted', '']
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database insert error:', error);
    return NextResponse.json({ error: 'Failed to add model request' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email || !ALLOWED_EMAILS.includes(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { id, legal, cyber, procurement, comments } = body;
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    // Build dynamic update query
    const updates = [];
    const values = [];
    let idx = 2;
    if (legal) {
      updates.push(`legal_status = $${idx++}`);
      values.push(legal);
    }
    if (cyber) {
      updates.push(`cyber_status = $${idx++}`);
      values.push(cyber);
    }
    if (procurement) {
      updates.push(`procurement_status = $${idx++}`);
      values.push(procurement);
    }
    if (typeof comments !== 'undefined') {
      updates.push(`comments = $${idx++}`);
      values.push(comments);
    }
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    const query = `UPDATE newmodel_request SET ${updates.join(', ')} WHERE id = $1`;
    await pool.query(query, [id, ...values]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({ error: 'Failed to update model status' }, { status: 500 });
  }
} 