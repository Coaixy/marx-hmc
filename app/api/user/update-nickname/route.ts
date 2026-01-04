import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { deviceId, nickname } = await req.json();

    if (!deviceId || !nickname) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update or insert nickname in device_user_config
    await pool.execute(
      'INSERT INTO device_user_config (device_id, nickname) VALUES (?, ?) ON DUPLICATE KEY UPDATE nickname = ?',
      [deviceId, nickname, nickname]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Nickname Error:', error);
    return NextResponse.json({ error: 'Failed to update nickname' }, { status: 500 });
  }
}

