/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-07-31 17:44:21
 * @Description: list 组件
 */
import React, { useEffect, useRef } from 'react';
import { List, ListItem } from '@material-ui/core';

import type { ListProps } from '@/types/components';

import Chat from '@/components/chat';

import '@/styles/components/welcome.scss';

const Comp = ({ list }: ListProps) => {
    const listRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current?.scrollHeight + 200;
    }, [list]);

    return (
        <List ref={listRef}>
            {list?.map((item, index) => (
                <ListItem>
                    <Chat key={index} {...item} />
                </ListItem>

            ))}
        </List>
    );
}

export default Comp;
