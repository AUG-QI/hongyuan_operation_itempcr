import axios from '../../services/axios';

export interface PassWordLoginParams {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
}

/**
 * 登陆请求接口
 * @param params
 * @returns
 */
export const passwordlogin = (params: PassWordLoginParams) => {
    return new Promise((resolve, reject) => {
        axios.post('/user/login', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            account: params.username,
            password: params.password,
        })
            .then((response: any) => {
                if (response.code === 200) {
                    resolve(response.data);
                }
                resolve('error');
            })
            .catch(() => {
                reject('error');
            });
    });
};
