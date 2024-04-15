import React, { useCallback, useMemo, useState } from 'react';
import { Input, Checkbox, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import '@/styles/index.scss'

function App() {
    const [val, setVal] = useState('');
    const [list, setList] = useState([]);
    const [btnK, setBtnK] = useState('all');

    const handleToggle = useCallback(() => {
        if (list?.length <= 0) return;
        const isExistFalse = list?.findIndex(item => !item?.status);
        let _list = list;
        if (isExistFalse >= 0)
            _list = list?.map(item => {
                item.status = true;
                return item;
            });
        else
            _list = list?.map(item => {
                item.status = false;
                return item;
            });
        setList([..._list]);
    }, [list]);

    const PreComp = useMemo(() => {
        return (
            <label className='iptL' onClick={handleToggle} />
        );
    }, [handleToggle]);

    const handleClose = useCallback((index) => {
        if (!list?.[index]) return;
        list.splice(index, 1);
        setList([...list]);
    }, [list]);
    const handleLi = useCallback((e ,index) => {
        if (!list?.[index]) return;
        list[index].status = e?.target?.checked;
        setList([...list]);
    }, [list]);

    const Item = useCallback(({ data, index }) => {
        if (btnK === 'active' && data?.status) return;
        if (btnK === 'completed' && !data?.status) return;
        return (
            <li key={data?.key}>
                <div className='liItem'>
                    <Checkbox
                        checked={data?.status}
                        className={`liLabel ${data?.status && 'liActive'}`}
                        onChange={e => handleLi(e, index)}
                    >{data?.label}</Checkbox>
                    <CloseOutlined className='liClose' onClick={() => handleClose(index)} />
                </div>
                <Divider className='line' />
            </li>
        );
    }, [handleClose, handleLi, btnK]);

    const handleEnter = useCallback(() => {
        if (val?.length < 2) return console.warn('长度必须大于1');
        setList([...list, {
            key: list?.length + 1,
            label: val,
            status: false,
        }]);
        setVal('');
    }, [val, list]);

    const handleBtn = useCallback((type) => {
        if (type === 'clearCompleted') {
            const _list = list?.filter(item => !item?.status);
            setList([..._list]);
            return;
        }
        setBtnK(type);
    }, [list]);

    return (
        <div className='container'>
            <h1 className='title'>todos</h1>
            <section className='content'>
                <div className='iptContainer'>
                    <Input
                        className='ipt'
                        value={val}
                        placeholder="What needs to be done?"
                        prefix={PreComp}
                        onChange={e => setVal(e?.target.value)}
                        onPressEnter={handleEnter}
                    />
                </div>
                {list?.length > 0 && (
                    <>
                        <ul className='listContainer'>
                            {list?.map((item, index) => Item({ data: item, index }))}
                        </ul>
                        <div className='listFooter'>
                            <p className='l'>{list?.length} items left!</p>
                            <div className='c'>
                                <span className={`btn ${btnK === 'all' && 'active'}`} onClick={() => handleBtn('all')}>All</span>
                                <span className={`btn ${btnK === 'active' && 'active'}`} onClick={() => handleBtn('active')}>Active</span>
                                <span className={`btn ${btnK === 'completed' && 'active'}`} onClick={() => handleBtn('completed')}>Completed</span>
                            </div>
                            <p className='r' onClick={() => handleBtn('clearCompleted')}>Clear Completed</p>
                        </div>
                    </>
                )}
            </section>
            <footer className='footer'>
                <p>Double-click to edit a todo</p>
                <p>Created by the TodoMVC Team</p>
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
            </footer>
        </div>
    );
}

export default App;
