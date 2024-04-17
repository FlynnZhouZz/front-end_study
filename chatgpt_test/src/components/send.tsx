/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 17:39:50
 * @Description: 发送组件
 */
import React from 'react';
import { Paper, InputBase, IconButton, CircularProgress } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import type { SendProps } from '@/types/components';

import '@/styles/components/send.scss';

function Send(props: SendProps) {
    return (
        <Paper component='form' className='sendContainer'>
            <InputBase
                className='input'
                multiline
                placeholder='Message ChatGPT...'
                inputProps={{ 'aria-label': 'Message ChatGPT' }}
            />
            <IconButton color='primary' className='btn' aria-label='send'>
                <ArrowUpwardIcon className='icon' />
                {/* <CircularProgress /> */}
            </IconButton>
        </Paper>
    );
}

export default Send;
