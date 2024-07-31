import cors from 'cors';
import OpenAI from 'openai';
import express from 'express';

const port = 3001;
const openaiConf = {
    model: 'gpt-3.5-turbo',
    baseUrl:'https://openrouter.ai/api/v1',
    headers: {
        'HTTP-Referer': 'http://localhost:3001', // Optional, for including your app on openrouter.ai rankings.
        'X-Title': 'ChatGPT test', // Optional. Shows in rankings on openrouter.ai.
    },
};

const app: express.Application = express();

app.use(express.json());
app.use(express.static(`${__dirname}/dist/`));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/* 聊天接口 */
app.get('/chat', async (req, res, next) => {
    const { msg, key: apiKey } = req.query as { msg: string; key: string }; // 从 url 参数中获取 msg,key
    if (!apiKey) return;
    if (!msg || msg?.trim() === '') {
        res.end('msg必填');
        return;
    }

    try {
        const openai = new OpenAI({
            baseURL: openaiConf.baseUrl,
            apiKey,
            defaultHeaders: openaiConf.headers,
            // dangerouslyAllowBrowser: true,
        });
        const gptStream = await openai.chat.completions.create({
            model: openaiConf.model,
            messages: [{ role: 'user', content: msg }],
            max_tokens: 500,
            stream: true, // stream
        })

        res.writeHead(200, { 'Content-Type': 'text/event-stream' }) // 'text/event-stream' 标识 SSE 即 Server-Sent Events

        for await (const chunk of gptStream) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`) // 格式必须是 `data: xxx\n\n` ！！！
        }
        res.end();
    } catch (error) {
        console.error('fetch openai error =>', error);
        res.writeHead(201, { 'Content-Type': 'text/event-stream' }) // 'text/event-stream' 标识 SSE 即 Server-Sent Events
        res.end();
    }
});

app.get("/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
});

app.listen(port, () => {
    console.info(`> Ready on http://localhost:${port}`);
});
