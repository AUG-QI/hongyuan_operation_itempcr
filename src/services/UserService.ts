import axios from '../services/axios';

export interface UserInfo {
    userId?: number;
}

/**
 * 设置用户信息
 * @param res
 */
export const setUserInfo = (res: any) => {
    window.userInfo = res;
};

/**
 * 通过接口获取用户信息
 */
export const fetchUserInfo = (): Promise<Partial<UserInfo>> => {
    return new Promise<Partial<UserInfo>>((resolve) => {
        axios
            .post('/user/getUserInfo', null)
            .then((response: any) => {
                if (response.code === 200) {
                    resolve(response.data);
                }
                resolve(response || {});
            })
            .catch(() => {
                resolve({});
            });
    });
};

/**
 * 获取用户信息
 */
export const getUserData = async () => {
    if (!window.userInfo?.nick) {
        const userInfo = await fetchUserInfo();
        if (!userInfo.nick) {
            location.hash = '/login';
        }
        await setUserInfo(userInfo);
    }
};
