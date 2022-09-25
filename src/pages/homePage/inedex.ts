

import { Modal } from "antd";

/**
 * 检查路由是否可以跳转
 * @param key 路由
 */
export const checkRouterJump = () : boolean => {
    if (sessionStorage.getItem('targetKeys')) {
        // let leave = window.confirm('系统可能不会保存您所做的修改', "您确定要离开设置页面吗?");
        
        // 禁止跳转
        Modal.destroyAll();
        // routerJumpWarningToInventoryPageDialog();
        // return false;
    }
    return true;
};
