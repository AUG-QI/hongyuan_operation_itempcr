/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-09-09 03:58:14
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-09-10 23:34:28
 * @FilePath: /simple-react-0909/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react({
            babel: {
                // 解决低版本浏览器不识别 ?. 的问题
                plugins: ['@babel/plugin-proposal-optional-chaining'],
            },
        }),
    ],
    server: {
    // 端口配置为 9000
        port: 9000,
        hmr: true,
    },

});
