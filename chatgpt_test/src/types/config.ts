/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-17 16:24:00
 * @Description: @/pages/config 类型声明
 */

/** 用户 */
export type User = {
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
