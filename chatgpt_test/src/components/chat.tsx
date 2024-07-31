/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 17:39:50
 * @Description: 聊天组件
 */
import React from 'react';
import { Avatar } from '@material-ui/core';

import type { ChatProps } from '@/types/components';

import '@/styles/components/chat.scss';

import chatGPTSvg from '@/assets/chatGPT.svg';

/** 头像组件 */
const Ava = (props: { type: ChatProps['type'] }) => {
    const { type } = props;
    return type === 1
        ? <div className='avatar user'><Avatar className='userAva'>CO</Avatar></div>
        : <div className='avatar gpt'><Avatar className='gptAva' src={chatGPTSvg} /></div>;
};

/** 名称组件 */
const Name = (props: { name: ChatProps['name'] }) => {
    const { name } = props;
    return <div className='name'>{name}</div>;
};

/* 聊天组件 */
const Chat = (props: ChatProps) => {
    const { type, name, msg = '' } = props;
    return (
        <div className='chatContainer'>
            <Ava type={type} />
            <div className='chatR'>
                <Name name={name} />
                <p>{msg || '-'}</p>
            </div>
        </div>
    );
}

export default Chat;
