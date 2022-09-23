/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-09-22 12:03:35
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-09-22 23:08:12
 * @FilePath: /hongyuan_operation_itempcr/src/pages/homePage/inedex.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Modal } from "antd";

/**
 * 检查路由是否可以跳转
 * @param key 路由
 */
export const checkRouterJump = () : boolean => {
    if (sessionStorage.getItem('targetKeys')) {
        // let leave = window.confirm('系统可能不会保存您所做的修改', "您确定要离开设置页面吗?");
        
        // 禁止跳转
        // Modal.destroyAll();
        // routerJumpWarningToInventoryPageDialog();
        // return false;
    }
    return true;
};
