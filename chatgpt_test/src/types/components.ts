/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 16:24:00
 * @Description: @/components 类型声明
 */

/** chat组件 props */
export type ChatProps = {
    /**
     * 用户类型
     *
     * 可选值：
     * - 1: 用户
     * - 2: GPT
     */
    type: 1 | 2;
    /** 用户名 */
    name: string;
    /** 留言 */
    msg?: string;
};

/** send组件 props */
export type SendProps = {
    /** OpenRouter API key */
    key: string;
    /** 留言 */
    msg?: string;
};
