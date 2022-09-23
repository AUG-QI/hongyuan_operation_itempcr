/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-09-20 15:59:15
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-09-23 14:10:59
 * @FilePath: /hongyuan_operation_itempcr/src/services/axios.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
// 对所有 axios 请求做处理
axios.defaults.withCredentials = true;

const instance = axios.create({
    baseURL: 'http://local.aiyongtech.com:3000/',
});
// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        if (config.url !== '/login') {
            // 判断请求是否是登录接口
            config.headers.token = sessionStorage.getItem('token'); // 如果不是登录接口，就给请求头里面设置token
        }
        return config; // 返回这个配置对象，如果没有返回，这个请求就不会发送出去
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        let code = res.data.code; // 获取后端返回的状态码
        if (code === 200) {
            // 成功
            return res.data.data; // 返回里面的数据，在使用这个axios时，获取到的东西就是这里返回的东西
        } else if (code == 401) {
            // token失效
            router.push('/login'); // 跳转登录页
        } else {
            return res.data;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// // 对单独的 axios 请求做处理
// let { data } = await axios.get('//localhost:3000', {
//     withCredentials: true,
// });

export default instance;
