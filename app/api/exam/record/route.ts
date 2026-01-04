import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { deviceId, nickname, examType, score, durationMs } = await req.json();

    if (!deviceId || score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Ensure user exists in device_user_config and update last active time
    if (nickname) {
      await pool.execute(
        'INSERT INTO device_user_config (device_id, nickname) VALUES (?, ?) ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), last_active_at = CURRENT_TIMESTAMP',
        [deviceId, nickname]
      );
    }

    // 2. Insert the exam record (without redundant nickname)
    const [result]: any = await pool.execute(
      'INSERT INTO exam_records (device_id, exam_type, score, duration_ms) VALUES (?, ?, ?, ?)',
      [deviceId, examType || 'default', score, durationMs || 0]
    );

    return NextResponse.json({ success: true, recordId: result.insertId });
  } catch (error) {
    console.error('Save Exam Record Error:', error);
    return NextResponse.json({ error: 'Failed to save exam record' }, { status: 500 });
  }
}

