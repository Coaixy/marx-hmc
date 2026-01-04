import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

// Get comments for a question
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const questionHash = searchParams.get('questionHash');

    if (!questionHash) {
      return NextResponse.json({ error: 'Missing questionHash' }, { status: 400 });
    }

    const query = `
      SELECT 
        c.id, 
        c.content, 
        c.created_at, 
        c.parent_id,
        u.nickname,
        c.device_id
      FROM question_comments c
      LEFT JOIN device_user_config u ON c.device_id = u.device_id
      WHERE c.question_hash = ? AND c.status = 1
      ORDER BY c.created_at ASC
    `;

    const [rows]: any = await pool.execute(query, [questionHash]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Get Comments Error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// Post a new comment
export async function POST(req: Request) {
  try {
    const { questionHash, deviceId, nickname, content, parentId } = await req.json();

    if (!questionHash || !deviceId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Ensure user exists in device_user_config
    if (nickname) {
      await pool.execute(
        'INSERT INTO device_user_config (device_id, nickname) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_active_at = CURRENT_TIMESTAMP',
        [deviceId, nickname]
      );
    }

    // 2. Insert comment
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    await pool.execute(
      'INSERT INTO question_comments (question_hash, device_id, content, ip_address, parent_id) VALUES (?, ?, ?, ?, ?)',
      [questionHash, deviceId, content, ip, parentId || 0]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Post Comment Error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}

