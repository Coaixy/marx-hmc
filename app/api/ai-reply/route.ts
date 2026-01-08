import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { questionHash, userComment, questionText, parentId } = await req.json();

    if (!questionHash || !userComment || !questionText || !parentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 构建AI提示词
    const systemPrompt = `你是一个专业的医学考试助手。用户在讨论一道医学题目时发表了评论，请你基于完整的题目信息（包括题干、选项和答案）和用户评论进行有帮助的回复。

要求：
1. 回复要严厉、专业、有建设性
2. 基于题目内容和正确答案提供准确的医学知识解释
3. 如果用户有疑问，要尽量解答并给出正确答案的解释
4. 可以适当引用题目选项来帮助说明
5. 回复要简洁明了，不要太长 不要超过300字
6. 用中文回复
7. 明确表明你是在回复用户的具体评论

${questionText}

用户评论：${userComment}`;

    // 调用DeepSeek API
    const apiKey = 'YOUR_DEEPSEEK_API_KEY';
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userComment
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`AI API error: ${data.error.message}`);
    }

    let aiReply = data.choices[0]?.message?.content?.trim();

    if (!aiReply) {
      throw new Error('No AI reply generated');
    }

    // 清理内容：去除 markdown 符号 (*、#、**、_、```等)
    aiReply = aiReply
      .replace(/\*\*/g, '') // 去除粗体标记
      .replace(/\*/g, '')   // 去除斜体/列表标记
      .replace(/\#+/g, '')  // 去除标题标记
      .replace(/\_+/g, '')  // 去除下划线
      .replace(/\`+/g, '')  // 去除代码块标记
      .replace(/\~/g, '')   // 去除删除线
      .replace(/^\s*[\-\+\*]\s+/gm, '') // 去除列表符号（行首的-、+、*）
      .replace(/^\s*\d+\.\s+/gm, '')    // 去除有序列表数字
      .replace(/\n\s*\n/g, '\n') // 合并多个空行
      .trim(); // 去除首尾空格

    // 将AI回复保存到数据库
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 确保AI助手在device_user_config表中存在
    await pool.execute(
      'INSERT INTO device_user_config (device_id, nickname) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_active_at = CURRENT_TIMESTAMP',
      ['ai-assistant', 'AI助手']
    );

    await pool.execute(
      'INSERT INTO question_comments (question_hash, device_id, content, ip_address, parent_id, is_ai) VALUES (?, ?, ?, ?, ?, ?)',
      [questionHash, 'ai-assistant', aiReply, ip, parentId, 1] // parent_id设为要回复的评论ID，is_ai设为1
    );

    return NextResponse.json({
      success: true,
      reply: aiReply
    });

  } catch (error) {
    console.error('AI Reply Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI reply' }, { status: 500 });
  }
}
