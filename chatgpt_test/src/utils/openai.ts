/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 16:18:22
 * @Description: openai 工具库
 */
import OpenAI from 'openai';

import type { FetchPayload } from '@/types/utils';

const openai = new OpenAI();

/** OpenAI model */
const openAIM = 'gpt-3.5-turbo';

export const fetch = async (messages: FetchPayload) => {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: openAIM,
    });
    console.log(completion.choices[0]);
};
