/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-07-31 18:02:08
 * @Description: alert 组件
 */
import React, { useCallback, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { type AlertProps as AlertP } from '@material-ui/lab/Alert';

import { AlertProps } from '@/types/components';

const Alert = (props: AlertP) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export const Message = (props: AlertProps) => {
    const { content, ...SnackbarProps } = props;
    const [openAlert, setOpenAlert] = useState(false);

    /* 监听关闭 alert */
    const handleAlertClose = useCallback(() => {
        setOpenAlert(false);
    }, []);

    return (
        <Snackbar
            open={openAlert}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={6000}
            onClose={handleAlertClose}
            {...SnackbarProps}
        >
            <Alert onClose={handleAlertClose} severity='error'>
                网络错误，请稍后重试！
            </Alert>
        </Snackbar>
    );
}

export default Alert;
