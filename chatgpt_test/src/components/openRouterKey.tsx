/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-18 14:32:04
 * @Description: openRouter api key组件
 */
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@material-ui/core';

import type { OpenRouterKeyProps } from '@/types/components';

import { storageKey } from '@/config';
import '@/styles/components/send.scss';

function Send(props: OpenRouterKeyProps) {
    const { open = false, onCb } = props;
    const [key, setKey] = useState('');

    const intiData = async () => {
        const k = await AsyncStorage.getItem(storageKey);
        if (k) setKey(k);
    };

    useEffect(() => {
        intiData();
    }, [open]);

    const handleClose = useCallback(() => {
        onCb?.();
    }, [onCb]);
    const handleConfirm = useCallback(async () => {
        await AsyncStorage.setItem(storageKey, key);
        onCb?.(key);
        setKey('');
    }, [onCb, key]);
    const handleIpt = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setKey(e.target.value);
    }, []);

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby='OpenRouter API key'>
            <DialogTitle id='OpenRouter API key'>OpenRouter API key</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    需要设置您的OpenRouter API key才能使用此程序。
                    关于获取OpenRouter API key：可以自行注册<a href='https://openrouter.ai' target='_blank' rel='noreferrer'>openrouter</a>，并使用里面提供的免费model “Mistral 7B Instruct”作为ai provider，以此为基础开发聊天对话机器人（自己注册之后用这里面的免费model就可以）
                </DialogContentText>
                <TextField
                    autoFocus
                    fullWidth
                    margin='dense'
                    id='openRouter_key'
                    label='OpenRouter API key'
                    type='text'
                    value={key}
                    onChange={handleIpt}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>
                    取消
                </Button>
                <Button onClick={handleConfirm} color='primary'>
                    确认
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Send;
