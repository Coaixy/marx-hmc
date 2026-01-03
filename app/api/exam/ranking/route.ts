import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examType = searchParams.get('examType') || 'default';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get top scores, grouped by device_id to show only the best score per user
    // Take the highest score for each user (device_id) with the shortest duration for that score
    const query = `
      SELECT nickname, MAX(score) as score, MIN(duration_ms) as duration_ms, MAX(created_at) as created_at, device_id
      FROM exam_records
      WHERE exam_type = ?
      GROUP BY device_id, nickname
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

