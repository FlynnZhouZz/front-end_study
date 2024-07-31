/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 16:24:00
 * @Description: @/components 类型声明
 */
import { type SnackbarProps } from '@material-ui/core';

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
    /** 回调函数 */
    onSend: (msg: string, cb?: () => void) => void;
};


/** openRouter key 组件 props */
export type OpenRouterKeyProps = {
    /** 是否展示 */
    open: boolean;
    /** 回调函数 */
    onCb: (key?: string) => void;
};

/** list 组件 props */
export type ListProps = {
    /** 列表 */
    list: ChatProps[];
};

/** alert 组件 props */
export type AlertProps = {
    /** 提示信息 */
    content?: string;
} & SnackbarProps;
