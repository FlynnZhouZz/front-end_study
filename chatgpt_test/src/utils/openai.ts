/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 16:18:22
 * @Description: openai 工具库
 */
import OpenAI from 'openai';

/** OpenAI model */
const openAIM = 'gpt-3.5-turbo';

export const fetch = async (content: string, apiKey: string) => {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey,
        defaultHeaders: {
            "HTTP-Referer": 'http://localhost:3000', // Optional, for including your app on openrouter.ai rankings.
            "X-Title": 'ChatGPT test', // Optional. Shows in rankings on openrouter.ai.
        },
        dangerouslyAllowBrowser: true,
    });
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content }],
        model: openAIM,
        // stream: true,
    });
    return completion.choices[0];
};
