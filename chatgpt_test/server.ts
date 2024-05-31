import { createServer } from 'http';
import OpenAI from 'openai';
import 'dotenv/config';
import { createReadStream } from 'fs';
import express from 'express';

const app: express.Application = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});


// app.use(async (req, res, next) => {
//     if (staticReg.test(req.url)) {
//         return next();
//     }

//     res.setHeader('Content-Type', 'text/html');
//     const context = {};
//     const { html, error, /* rootContainer */ } = await render({
//         // 有需要可带上 query
//         path: req.url,
//         context,
//         // 可自定义 html 模板
//         // htmlTemplate: defaultHtml,
//         // 启用流式渲染
//         mode: 'string',
//         // html 片段静态标记（适用于静态站点生成）
//         // staticMarkup: false,
//         // 扩展 getInitialProps 在服务端渲染中的参数
//         getInitialPropsCtx: { req, res },
//         // manifest，正常情况下不需要
//     });

//     if (error) console.warn(req.hostname, error);
//     if (!res._isOver) res.send(html);
// });

// const port = 3001;
// createServer(async (req, res) => {
//     const url = new URL(req.url!, 'file:///')
//     console.log('url.pathname ', url.pathname)
//     const query = Object.fromEntries(url.searchParams.entries())
//     console.log('query ', query)

//     if (url.pathname === '/') {
//         // 首页路由，返回 index.html
//         createReadStream('./index.html').pipe(res)
//         return
//     }

//     if (url.pathname === '/chat') {
//         const msg = query.msg || ''; // 从 url 参数中获取 msg
//         const apiKey = query.key || ''; // 从 url 参数中获取 key
//         if (!apiKey) return;
//         if (msg.trim() === '') {
//             res.end('query prompt is required')
//             return
//         }
//         const openai = new OpenAI({
//             baseURL: "https://openrouter.ai/api/v1",
//             apiKey,
//             defaultHeaders: {
//                 "HTTP-Referer": 'http://localhost:3001', // Optional, for including your app on openrouter.ai rankings.
//                 "X-Title": 'ChatGPT test', // Optional. Shows in rankings on openrouter.ai.
//             },
//             // dangerouslyAllowBrowser: true,
//         });
//         const gptStream = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: [{ role: 'user', content: msg }],
//             max_tokens: 100,
//             stream: true, // stream
//         })
//         res.writeHead(200, { 'Content-Type': 'text/event-stream' }) // 'text/event-stream' 标识 SSE 即 Server-Sent Events
//         for await (const chunk of gptStream) {
//             console.log('chunk ', JSON.stringify(chunk))
//             res.write(`data: ${JSON.stringify(chunk)}\n\n`) // 格式必须是 `data: xxx\n\n` ！！！
//         }
//         req.on('close', () => {
//             console.log('req close...')
//         })
//         return '123';
//     }

//     // 其他情况
//     res.end('other route')
// }).listen(port)

console.log(`Server running at http://localhost:${port}/`)
