
import axios from '../services/axios';

export interface UserInfo {
    userId?: number;
}

/**
 * 设置用户信息
 * @param res
 */
export const setUserInfo = (res: any) => {
    sessionStorage.setItem('userInfo', JSON.stringify(res));
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
    const userInfoJson: any = sessionStorage.getItem('userInfo') || null;
    let userInfo: any = {};
    if (userInfoJson) {
        userInfo = JSON.parse(userInfoJson);
    }
    if (!userInfo?.nick) {
        const resUserInfo: any = await fetchUserInfo();
        if (!resUserInfo.nick) {
            location.hash = '/login';
        }
        setUserInfo(resUserInfo);
    }
};
