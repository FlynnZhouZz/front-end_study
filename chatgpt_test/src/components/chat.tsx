/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 17:39:50
 * @Description: 聊天组件
 */
import React, { useMemo } from 'react';
import { Container } from '@material-ui/core';

import type { ChatProps } from '@/types/components';

import { Avatar } from '@material-ui/core';

import '@/styles/components/chat.scss';

const Ava = (props: { type: ChatProps['type'] }) => {
    const { type } = props;
    return type === 1 ? <Avatar>CO</Avatar> : <Avatar>H</Avatar>;
};

const Name = (props: { name: ChatProps['name'] }) => {
    const { name } = props;
    return <div>{name}</div>;
};

function Chat(props: ChatProps) {
    return (
        <div className='chatContainer'>
            <Ava type={1} />
            <div className='chatR'>
                <Name name='123' />
                <p>1312</p>
            </div>
        </div>
    );
}

export default Chat;
