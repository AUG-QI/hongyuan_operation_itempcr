import axios from '../services/axios';
import { api } from './api';

export interface UserInfo {
    userId?: number;
}

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
            .then((response) => {
                resolve(response || {});
            })
            .catch((error) => {
                resolve({});
            });
    });
};

// 获取用户信息
export const getUserData = async () => {
    if (!window.userInfo?.nick) {
        // console.log("#查看用户是否需要刷新信息");
        const userInfo = await fetchUserInfo();
        // debugger;
        if (!userInfo.nick) {
            location.hash = '/login';
            // return;
        }
        await setUserInfo(userInfo);
    }
};
