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
