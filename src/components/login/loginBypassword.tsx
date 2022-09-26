import React, { FC } from 'react';
import { Button, Form, Input, message } from 'antd';
import { passwordlogin, PassWordLoginParams } from './api';
import './index.scss';

/**
 * 登录块，后续会有多种登录方式都会在这里处理
 */
export interface LoginByPasswordProps {
    /** 登录成功后的回调 */
    onLoginSuccessed: (userInfo: any) => void;
}

/** 登陆成功 */
const LoginByPassword: FC<LoginByPasswordProps> = (props) => {
    const { onLoginSuccessed } = props;
    /** 成功后的回调 */
    const handleLogin = async (values: PassWordLoginParams) => {
        const res = await passwordlogin(values);
        if (res !== 'success') {
            return message.error('账号或密码错误');
        }
        onLoginSuccessed(res);
    };

    return (
        <Form
            autoComplete="off"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            className="login-form"
        >
            <Form.Item
                label=""
                name="username"
                rules={[{ required: true, message: '请输入手机号' }]}
            >
                <Input placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item
                label=""
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password
                    placeholder="请输入密码"
                    visibilityToggle={false}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    block
                    type="primary"
                    htmlType="submit"
                    className="login-submit"
                >
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginByPassword;
