/*
 * @Author: foxfly
 * @Contact: 617903352@qq.com
 * @Date: 2024-07-31 18:02:08
 * @Description: alert 组件
 */
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export default Alert;
