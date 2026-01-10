import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    // 1. 生成缓存 Key (MD5 hash of messages)
    const questionText = JSON.stringify(messages);
    const questionHash = crypto.createHash('md5').update(questionText).digest('hex');

    // 2. 检查数据库缓存
    try {
      const [rows]: any = await pool.execute(
        'SELECT ai_response FROM ai_answer_cache WHERE question_hash = ?',
        [questionHash]
      );

      if (rows.length > 0) {
        console.log('Cache Hit:', questionHash);
        // 更新点击率
        await pool.execute(
          'UPDATE ai_answer_cache SET hit_count = hit_count + 1 WHERE question_hash = ?',
          [questionHash]
        );
        let cachedData = JSON.parse(rows[0].ai_response);
        // 确保缓存的内容也被清理
        if (cachedData.choices && cachedData.choices[0]?.message?.content) {
          cachedData.choices[0].message.content = cachedData.choices[0].message.content.replace(/\*/g, '');
        }
        return NextResponse.json(cachedData);
      }
    } catch (dbError) {
      console.error('Database Cache Check Error:', dbError);
      // 数据库错误不影响主流程，继续请求 AI
    }

    // 3. 缓存未命中，请求 AI
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        stream: false,
      }),
    });

    const data = await response.json();

    // 4. 清理内容：去除 * 等 markdown 符号
    if (data.choices && data.choices[0]?.message?.content) {
      data.choices[0].message.content = data.choices[0].message.content.replace(/\*/g, '');
    }

    // 5. 将结果存入缓存
    if (data && !data.error) {
      try {
        await pool.execute(
          'INSERT INTO ai_answer_cache (question_hash, question_text, ai_response, model_name) VALUES (?, ?, ?, ?)',
          [questionHash, questionText, JSON.stringify(data), 'deepseek-chat']
        );
      } catch (dbSaveError) {
        console.error('Database Cache Save Error:', dbSaveError);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from DeepSeek API' }, { status: 500 });
  }
}
