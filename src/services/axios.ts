/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-09-20 15:59:15
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-09-21 20:17:08
 * @FilePath: /simple-react-0909/src/services/axios.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
// 对所有 axios 请求做处理
axios.defaults.withCredentials = true;

const instance = axios.create({
    baseURL: 'http://local.aiyongtech.com:3000/',
});


// // 对单独的 axios 请求做处理
// let { data } = await axios.get('//localhost:3000', {
//     withCredentials: true,
// });

export default instance;
