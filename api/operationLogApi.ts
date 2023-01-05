/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-12-08 12:27:27
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-12-12 14:52:26
 * @FilePath: /hongyuan_operation_itempcr/api/operationLogApi.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** 操作日志api */
import axios from "../src/services/axios";

/**
 * 获取库存操作日志
 * @returns
 */
export const getBiyaoInventoryOperationLog = (params: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/getBiyaoInventoryOperationLog', { ...params })
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve([]);
                }
                resolve(response.data);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};
/**
 * 设置库存操作日志
 * @returns
 */
export const updateBiyaoInventoryOperationLog = (params: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/updateBiyaoInventoryOperationLog', params)
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve([]);
                }
                resolve(response.data);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};
