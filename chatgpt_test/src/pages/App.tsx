/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-19 11:17:31
 * @Description: app
 */
import React, { useEffect, useCallback, useState } from 'react';
import { Container, IconButton, Snackbar } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import type { ChatProps } from '@/types/components';

import List from '@/components/list';
import Send from '@/components/send';
import Alert from '@/components/alert';
import Welcome from '@/components/welcome';
import OpenRouterKey from '@/components/openRouterKey';

import { storageKey } from '@/config';

import '@/styles/index.scss';

const URL = 'http://localhost:3001';

const App = () => {
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [key, setKey] = useState('');
    const [list, setList] = useState<ChatProps[]>([]);

    /* 获取换成api key */
    const getKey = () => {
        const k = localStorage.getItem(storageKey);
        if (k) {
            setKey(k);
            return true;
        } else setOpen(true);
    };

    useEffect(() => {
        getKey();
    }, []);

    /* 监听 OpenRouterKey 回调 */
    const handleOpenCb = useCallback((key?: string) => {
        setOpen(!open);
        if (key) setKey(key);
    }, [open]);

    /* 监听 设置 api key 按钮事件 */
    const handleKeyBut = useCallback(() => {
        setOpen(!open);
    }, [open]);

    /* 请求ChatGPT api */
    const exec = useCallback(async (msg: string, close?: () => void) => {
        const closeFn = () => {
            es.close(); // 结束
            close?.();
        };
        const url = `${URL}/chat?msg=${msg}&key=${key}`;
        const es = new EventSource(url); // 向服务端发起持久化请求连接

        // 监听消息流
        es.onmessage = (event) => {
            const data = event.data || '';
            if (data === '[DONE]') {
                console.info('end...');  // 结束
                closeFn();
                return;
            }

            const obj = JSON.parse(data); // 服务端每次 res.write 返回的信息
            const { delta: { content }, finish_reason } = obj.choices[0];

            if (finish_reason === 'stop') {
                console.info('stop...');  // 一段回答结束
                closeFn();
                return;
            } else if (content) {
                setTimeout(() => {
                    setList((prevList) => {
                        let lastIndex = prevList.length <= 0 ? 0 : prevList.length - 1;
                        if (prevList[lastIndex]?.type !== 2) {
                            // 如果聊天记录最后一条不是机器人，则拼接一条机器人回答对象
                            return [...prevList, {
                                type: 2,
                                name: 'ChatGPT',
                                msg: content,
                            }];
                        } else {
                            // 聊天记录最后一条是机器人,则直接在机器人回答的内容后面拼接新回答
                            const newList = prevList.map((item, index) => {
                                if (index === lastIndex) {
                                    return {
                                        ...item,
                                        msg: item.msg + content,
                                    };
                                }
                                return item;
                            });
                            return [...newList];
                        }
                    });
                }, 10);
            }
        }

        // 监听错误
        es.onerror = (e) => {
            console.error('error -> ', e)
            setOpenAlert(true);
            closeFn();
        };
    }, [key]);

    /* 监听发送事件 */
    const handleSend = useCallback(async (msg: string, cb?: () => void) => {
        const isExistKey = await getKey();
        if (!isExistKey) return cb?.();
        setList((prevList => [...prevList, {
            type: 1,
            name: 'You',
            msg,
        }]));

        // 请求
        await exec(msg, () => cb?.());
    }, [exec]);

    /* 监听关闭 alert */
    const handleAlertClose = useCallback(() => {
        setOpenAlert(false);
    }, []);

    return (
        <Container maxWidth='md' className='container'>
            <div className='chatBox'>
                {list?.length <= 0 ? (
                    <Welcome />
                ) : (
                    <List list={list} />
                )}
            </div>
            <div className='sendBox'>
                <Send onSend={handleSend} />
                <IconButton
                    color='primary'
                    className='btnKey'
                    aria-label='openRouter key button'
                    onClick={handleKeyBut}
                    title='设置/修改 OpenRouter API key'
                >
                    <VpnKeyIcon className='key' />
                </IconButton>
            </div>
            <p className='tips'>使用Ctrl + Enter快捷键可快速发送消息！</p>
            <OpenRouterKey open={open} onCb={handleOpenCb} />
            <Snackbar
                open={openAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}
                onClose={handleAlertClose}
            >
                <Alert onClose={handleAlertClose} severity='error'>
                    网络错误，请稍后重试！
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default App;
