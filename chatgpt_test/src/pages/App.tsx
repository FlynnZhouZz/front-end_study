import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Container, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import type { ChatProps } from '@/types/components';

import Chat from '@/components/chat';
import Send from '@/components/send';
import OpenRouterKey from '@/components/openRouterKey';

import { storageKey } from '@/config';
import { fetch } from '@/utils/openai';
// import { sleep } from '@/utils';

import openaiLogo from '@/assets/openai.png';
import '@/styles/index.scss';

function App() {
    const listRef = useRef<HTMLUListElement | null>(null);
    const [open, setOpen] = useState(false);
    const [key, setKey] = useState('');
    const [list, setList] = useState<ChatProps[]>([]);

    const getKey = async () => {
        const k = await AsyncStorage.getItem(storageKey);
        if (k) {
            setKey(k);
            return true;
        } else setOpen(true);
    };

    useEffect(() => {
        getKey();
    }, []);
    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current?.scrollHeight + 200;
    }, [list]);

    const handleOpenCb = useCallback((key?: string) => {
        setOpen(!open);
        if (key) setKey(key);
    }, [open]);
    const handleKeyBut = useCallback(() => {
        setOpen(!open);
    }, [open]);

    const exec = async (msg: string) => {

        const response = await axios.get('http://localhost:3000/chat', {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            },
            responseType: 'stream',
            params: { msg, key },
        });

        const stream = response.data
        stream.on('data', (data: any) => {
            data = data.toString()
            console.log(data)
        })
        return;

        const url = new URL('/chat', '')
        url.searchParams.set('msg', msg);
        url.searchParams.set('key', key);

        const es = new EventSource(url) // 向服务端发起请求
        console.log('ew', es)
        es.onmessage = (event) => {
            console.log('1231-->', event);
            const data = event.data || '';
            if (data === '[DONE]') {
                // 结束
                console.log('done...')
                es.close()
                return
            }

            const obj = JSON.parse(data)
            console.log('obj... ', obj)

            const content = obj.choices[0].delta.content
            if (content == null) {
                // 可能因为其他原因停止
                console.log('stop...')
                es.close()
                return
            }

            // answerElem.textContent += content
        }
    }
    const handleSend = useCallback(async (msg: string, cb?: () => void) => {
        const isExistKey = await getKey();
        if (!isExistKey) return cb?.();
        const _list: ChatProps[] = [...list, {
            type: 1,
            name: 'You',
            msg,
        }];
        setList(_list);

        // 请求
        await exec(msg);
        return;
        // const chatGptRes = await fetch(msg, key);
        // if (chatGptRes?.finish_reason === 'stop' && chatGptRes?.message?.content) {
        //     const _lis: ChatProps[] = [..._list, {
        //         type: 2,
        //         name: 'ChatGPT',
        //         msg: chatGptRes?.message?.content,
        //     }];
        //     setList(_lis);
        // }
        // cb?.();
    }, [key, list]);

    return (
        <Container maxWidth='sm' className='container'>
            <div className='chatBox'>
                {list?.length <= 0 ? (
                    <div className='emptyBox'>
                        <img src={openaiLogo} alt='ChatGPT logo' className='gptLogo' />
                        <p>How can I help you today?</p>
                    </div>
                ) : (
                    <List ref={listRef}>
                        {list?.map((item, index) => (
                            <ListItem>
                                <Chat key={index} {...item} />
                            </ListItem>

                        ))}
                    </List>
                )}
            </div>
            <div className='sendBox'>
                <Send onSend={handleSend} />
                <IconButton
                    color='primary'
                    className='btnKey'
                    aria-label='openRouter key button'
                    onClick={handleKeyBut}
                >
                    <VpnKeyIcon className='key' />
                </IconButton>
            </div>
            <p className='tips'>使用Ctrl + Enter快捷键可快速发送消息！</p>
            <OpenRouterKey open={open} onCb={handleOpenCb} />
        </Container>
    );
}

export default App;
