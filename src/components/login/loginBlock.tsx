import React, { FC } from 'react';
import LoginByPassword from './loginBypassword';

/**
 * 登录块，后续会有多种登录方式都会在这里处理
 */
export interface LoginBlockProps {
    /** 登录成功后的回调 */
    onLoginSuccessed: (userInfo: any) => void;
}

/**
 * 这样的话，组件可以集成到弹窗和页面中。
 * @returns
 */
const LoginBlock: FC<LoginBlockProps> = (props) => {
    return <LoginByPassword {...props} />;
};

export default LoginBlock;
