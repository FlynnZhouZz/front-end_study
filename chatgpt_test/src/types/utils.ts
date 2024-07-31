/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 16:24:00
 * @Description: @/utls 类型声明
 */
import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

/** fetch payload */
export type FetchPayload = {
    /** fetch  */
    msg: ChatCompletionCreateParamsBase['messages'];
};

/** message type */
export type MessageType = {
    dom: HTMLDivElement | null;
};
