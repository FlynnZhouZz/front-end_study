/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 17:39:50
 * @Description: 发送组件
 */
import React, { useCallback, useState } from 'react';
import { Paper, InputBase, IconButton, CircularProgress } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import type { SendProps } from '@/types/components';

import '@/styles/components/send.scss';

function Send(props: SendProps) {
    const { onSend } = props;
    const [disabled, setDisabled] = useState(false);
    const [val, setVal] = useState('');

    const handleSend = useCallback(() => {
        if (disabled || !val) return;
        setDisabled(true);
        onSend(val, () => {
            setDisabled(false);
        });
    }, [disabled, val, onSend]);
    const handleIpt = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value);
    }, []);

    return (
        <Paper component='form' className='sendContainer'>
            <InputBase
                multiline
                minRows={1}
                maxRows={10}
                className='input'
                placeholder='Message ChatGPT...'
                inputProps={{ 'aria-label': 'Message ChatGPT' }}
                value={val}
                onChange={handleIpt}
            />
            <IconButton color='primary' className='btn' aria-label='send' onClick={handleSend}>
                {disabled ? <CircularProgress size={14} className='iconLoading' /> : <ArrowUpwardIcon className='icon' />}
            </IconButton>
        </Paper>
    );
}

export default Send;
