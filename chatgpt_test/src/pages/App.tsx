import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Container, IconButton, List, ListItem } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ChatProps } from '@/types/components';

import Chat from '@/components/chat';
import Send from '@/components/send';
import OpenRouterKey from '@/components/openRouterKey';

import { storageKey } from '@/config';

import openaiLogo from '@/assets/openai.png';
import '@/styles/index.scss';

const URL = 'http://localhost:3001';

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

    const exec = useCallback(async (msg: string, close?: () => void) => {
        const url = `${URL}/chat?msg=${msg}&key=${key}`;
        const es = new EventSource(url); // 向服务端发起请求

        es.onmessage = (event) => {
            const data = event.data || '';
            if (data === '[DONE]') {
                es.close(); // 结束
                close?.();
                return;
            }

            const obj = JSON.parse(data); // 服务端每次 res.write 返回的信息

            const { delta: { content }, finish_reason } = obj.choices[0];
            console.log(finish_reason, content);
            if (finish_reason === 'stop') {
                console.log('stop...');  // 一段回答结束
                es.close();
                close?.();
                return;
            }

            setList((list) => {
                let newHistory;
                // 如果聊天记录最后一条不是机器人，则拼接一条机器人回答对象
                if (list[list.length - 1].name !== 'ChatGPT') {
                    newHistory = [...list, {
                        type: 2,
                        name: 'ChatGPT',
                        msg: content,
                    }];
                } else {
                    // 聊天记录最后一条是机器人,则直接在机器人回答的内容后面拼接新回答
                    list[list.length - 1].msg = list[list.length - 1].msg + content;
                    // 不能直接history赋值，要加上[... ]生成新对象,否则setState会认为引用地址没变，不执行页面刷新
                    // TODO 此处有重复bug
                    newHistory = [...list];
                }
                return newHistory as ChatProps[];
            });
        }
    }, [key]);
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
        await exec(msg, () => cb?.());
    }, [exec, list]);

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
