import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examType = searchParams.get('examType') || 'default';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get top scores, grouped by device_id to show only the best score per user if needed
    // But usually ranking shows all records or best per user. 
    // Let's do best score per user for a cleaner leaderboard.
    const query = `
      SELECT nickname, score, duration_ms, created_at, device_id
      FROM exam_records
      WHERE exam_type = ?
      ORDER BY score DESC, duration_ms ASC
      LIMIT ?
    `;

    const [rows]: any = await pool.query(query, [examType, limit]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Get Ranking Error:', error);
    return NextResponse.json({ error: 'Failed to fetch ranking' }, { status: 500 });
  }
}

