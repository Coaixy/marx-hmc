import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examType = searchParams.get('examType') || 'default';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get top scores, grouped by device_id to show only the best score per user
    // Join with device_user_config to get the latest nickname
    const query = `
      SELECT 
        COALESCE(u.nickname, '匿名用户') as nickname, 
        MAX(r.score) as score, 
        MIN(r.duration_ms) as duration_ms, 
        MAX(r.created_at) as created_at, 
        r.device_id
      FROM exam_records r
      LEFT JOIN device_user_config u ON r.device_id = u.device_id
      WHERE r.exam_type = ?
      GROUP BY r.device_id
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

