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
