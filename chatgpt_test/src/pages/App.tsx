import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Container, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const listRef = useRef(null);
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

    const handleOpenCb = useCallback((key?: string) => {
        setOpen(!open);
        if (key) setKey(key);
    }, [open]);
    const handleKeyBut = useCallback(() => {
        setOpen(!open);
    }, [open]);
    const handleSend = useCallback(async (msg: string, cb?: () => void) => {
        const isExistKey = await getKey();
        if (!isExistKey) return cb?.();
        const _list: ChatProps[] = [...list, {
            type: 1,
            name: 'You',
            msg,
        }];
        setList(_list);
        const chatGptRes = await fetch(msg, key);
        if (chatGptRes?.finish_reason === 'stop' && chatGptRes?.message?.content) {
            const _lis: ChatProps[] = [..._list, {
                type: 2,
                name: 'ChatGPT',
                msg: chatGptRes?.message?.content,
            }];
            setList(_lis);
        }
        cb?.();
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
                    <List>
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
            <OpenRouterKey open={open} onCb={handleOpenCb} />
        </Container>
    );
}

export default App;
