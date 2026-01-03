import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { deviceId, nickname } = await req.json();

    if (!deviceId || !nickname) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update nickname in all past exam records for this device
    await pool.execute(
      'UPDATE exam_records SET nickname = ? WHERE device_id = ?',
      [nickname, deviceId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Nickname Error:', error);
    return NextResponse.json({ error: 'Failed to update nickname' }, { status: 500 });
  }
}

