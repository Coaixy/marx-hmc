import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { deviceId, nickname, examType, score, durationMs } = await req.json();

    if (!deviceId || score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [result]: any = await pool.execute(
      'INSERT INTO exam_records (device_id, nickname, exam_type, score, duration_ms) VALUES (?, ?, ?, ?, ?)',
      [deviceId, nickname || '匿名用户', examType || 'default', score, durationMs || 0]
    );

    return NextResponse.json({ success: true, recordId: result.insertId });
  } catch (error) {
    console.error('Save Exam Record Error:', error);
    return NextResponse.json({ error: 'Failed to save exam record' }, { status: 500 });
  }
}

