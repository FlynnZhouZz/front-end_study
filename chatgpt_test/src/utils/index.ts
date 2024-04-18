/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-04-18 16:17:44
 * @Description: 常用工具
 */

/**
 * 延迟
 * @param t 延迟时间，单位：毫秒
 * @returns
 */
export const sleep = (t: number) => new Promise((v) => setTimeout(v, t));
