import config from '../../config';
import axios from '../../services/axios';

/**
 * 管控下架搜索数据
 * @returns
 */
export const getDistributeErrorLog = (params: any) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        for (const key in params) {
            formData.append(key, params[key]);
        }
        axios.post('/Distributeitem/getDistributeErrorLog', formData, {
            baseURL: config.BASE_1688_URL,
            withCredentials: false,
            headers: { 'X-From-App': 'biyao' },
        })
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve([]);
                }
                resolve(response.result);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

/**
 * 获取库存同步日志
 * @returns
 */
export const getSyncStockLog = (params: any) => {
    return new Promise((resolve, reject) => {
        axios.get('/Distributeitem/getSyncStockLog', {
            baseURL: config.BASE_1688_URL,
            headers: { 'X-From-App': 'biyao' },
            params,
        })
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve([]);
                }
                resolve(response.result);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};
/**
 * 管控下架搜索数据
 * @returns
 */
export const searchItemRemovedLog = (params: any) => {
    return new Promise((resolve, reject) => {
        axios.post('/itemManage/searchItemRemovedLog', params)
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
 * 取消代销日志
 * @returns
 */
export const getDelRelationLog = (params: any) => {
    return new Promise((resolve, reject) => {
        axios.get('Distributeitem/getDelRelationLog', {
            baseURL: config.BASE_1688_URL,
            headers: { 'X-From-App': 'biyao' },
            params,
        })
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve([]);
                }
                resolve(response.result);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

/**
 * 获取操作日志数据
 * @returns
 */
export const getOperationLog = (params: any) => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/getOperationLog', params)
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
 * 获取操作日志数据
 * @returns
 */
export const getAbnormalPurchaseOrderList = (params: any) => {
    const fields = 'status,origin_fail_reson,num_iid,sku_id,num,title,sku_properties_name,seller_nick,orders,distributor_nick,distributor_id';
    const storeId = 'BIYAO';
    const appName = 'tradeSupplier';
    return new Promise((resolve, reject) => {
        axios.post('itemManage/getAbnormalPurchaseOrderList', { ...params, fields, storeId, appName })
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
 * 获取操作日志数据
 * @returns
 */
export const distributeOperate = (params: any) => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/distributeOperate', { ...params })
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve(response.message);
                }
                resolve('success');
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};
/**
 * 获取飞书修改日志
 * @returns
 */
export const feishuUpdateLog = (params: any) => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/getFeishuRobotUpdateLog', { ...params })
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
 * 获取飞书配置列表
 * @returns
 */
export const getRobotConfigurationList = (params: any) => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/getFeishuConfigurationList', { ...params })
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
 * 编辑飞书群信息
 * @returns
 */
export const editorRobotConfigurationList = (params: any) => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/editorFeishuRobotGroupInfo', { ...params })
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve('error');
                }
                resolve(response.data || 'error');
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};
