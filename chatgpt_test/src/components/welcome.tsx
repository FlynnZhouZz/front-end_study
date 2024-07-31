/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-07-31 17:36:32
 * @Description: 欢迎组件
 */
import React from 'react';
import '@/styles/components/welcome.scss';

import openaiLogo from '@/assets/openai.png';

const Welcome = () => {
    return (
        <div className='emptyBox'>
            <img src={openaiLogo} alt='ChatGPT logo' className='gptLogo' />
            <p>How can I help you today?</p>
        </div>
    );
}

export default Welcome;
