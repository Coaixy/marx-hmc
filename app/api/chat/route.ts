import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = 'YOUR_DEEPSEEK_API_KEY';

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
    return NextResponse.json(data);
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from DeepSeek API' }, { status: 500 });
  }
}
