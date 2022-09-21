/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-09-09 03:27:21
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-09-21 16:06:26
 * @FilePath: /simple-react-0909/src/services/UserService.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from '../services/axios';
import { api } from './api';


export interface UserInfo {
    userId: number;
    storeId: string;
}

export const setUserInfo = (res: any) => {
    window.userInfo = res;
};

/**
 * 通过接口获取用户信息
 */
export const fetchUserInfo = (): Promise<Partial<UserInfo>> => {
    axios.post('/user/getUserInfo', null,
        {
            baseURL: 'http://local.aiyongtech.com:3000',
        }
        )
        .then((response) => {
            console.log(response, '????responseqyt_');
        })
        .catch((error) => {
            console.log(error, '????error');
        });
    // return new Promise<Partial<UserInfo>>((resolve) => {
    //     api({
    //         host: 'http://local.aiyongtech.com:3000',
    //         method: '/user/getUserInfo',
    //         callback: (userinfo: Partial<UserInfo>) => {
    //             resolve(userinfo);
    //         },
    //         errCallback: (err: any) => {
    //             resolve({});
    //         },
    //     });
    // });
};

// 获取用户信息
export const getUserData = async () => {
    if (!(window.is_ssr && (window.userInfo || {}).userNick)) {
        // 在ssr的状态下不需要取
        // 本地开放走这里
        // console.log("#查看用户是否需要刷新信息");
        const userInfo = await fetchUserInfo();
        console.log(userInfo, '?????拿到的userInfo');

        // debugger;
        // if (!userInfo.storeId) {
        //     location.hash = '/login';
        //     return;
        // }
        await setUserInfo(userInfo);
    } else {
        // 线上环境
    }
};
