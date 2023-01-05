import { message } from 'antd';
import moment from 'moment';
import axios from '../../services/axios';
import config from '../../config';

interface CategoryData {
    categoryId?: number;
    categoryName?: string;
    children?: CategoryData[];
}

/** 更新库存预警值参数 */
interface StockWarningInfo {
    /** 类目名称 */
    name: string;
    /** 子类目id */
    cid: number;
    /** 预警值 */
    prewarningValue: number;
    /** 上升阔值 */
    restoreValue: number;
}
/**
 * 请求获取商品列表
 */
export const reqSearchCommodity = (params: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('/itemManage/getItemList', params)
            .then((response: any) => {
                if (response.code !== 200) {
                    message.error('请求商品列表发生错误');
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
 * 类目数据转成树形
 * @param arr
 * @returns
 */
const setTreeData = (arr: CategoryData[]) => {
    if (!arr.length) {
        return [];
    }
    //  删除所有 children,以防止多次调用
    arr.forEach((item: CategoryData) => {
        delete item.children;
    });
    const map: any = {}; // 构建map
    arr.forEach((item: any) => {
        map[item.categoryId] = item; // 构建以area_id为键 当前数据为值
    });

    const treeData: CategoryData[] = [];
    arr.forEach((child: any) => {
        const mapItem = map[child.parentId]; // 判断当前数据的parent_id是否存在map中
        if (mapItem) { // 存在则表示当前数据不是最顶层数据
            // 注意: 这里的map中的数据是引用了arr的它的指向还是arr，当mapItem改变时arr也会改变,踩坑点
            (mapItem.children || (mapItem.children = [])).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
        } else { // 不存在则是组顶层数据
            treeData.push(child);
        }
    });
    return treeData;
};

interface DistributorParams {
    /** 店铺类型 */
    shop_type?: string;
    /** 销商关键词搜索 */
    key_word?: string;
    /** 货源商品id */
    origin_num_iid: string;
    /** 页码 */
    page_no?: number;
    /** 页面大小 */
    page_size?: number;

}

const ITEM_LIST_URL = 'Distributeitem/getItemListByOriginNumIid';

/**
 * 分销商列表搜索接口
 */
export const reqSearchDistributorList = (params: DistributorParams): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.get(ITEM_LIST_URL, {
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
 * 下架分销商商品
 */
export const deleteRelation = (params: any) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        for (const key in params) {
            formData.append(key, params[key]);
        }
        axios.post('/Distributeitem/deleteRelation', formData, {
            baseURL: config.BASE_1688_URL,
            withCredentials: false,
            headers: { 'X-From-App': 'biyao' },
        })
            .then((response: any) => {
                if (response.code && response.code !== 200) {
                    resolve({
                        is_success: false,
                        error_msg: response.message,
                    });
                }
                resolve(response.result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

/**
 * 获取类目选项
 * @returns
 */
export const getCategoryOptions = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        const nowDate = moment().format('YY-MM-DD');
        const dataJson = localStorage.getItem('categoryOptions');
        if (dataJson) {
            const data = JSON.parse(dataJson);
            // 同一天获取
            if (data.storageDate == nowDate) {
                // 处理一下数据再返回
                const categoryTreeData = setTreeData(data.categoryData);
                resolve(categoryTreeData);
                return;
            }
        }
        axios.post('/itemManage/getCategoryList', null)
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve([]);
                }
                const categoryData = response.data.data;
                if (!categoryData) {
                    resolve([]);
                }
                const categoryOptions = {
                    storageDate: nowDate,
                    categoryData,
                };
                // 做个缓存
                localStorage.setItem('categoryOptions', JSON.stringify(categoryOptions));
                const categoryTreeData = setTreeData(categoryData);
                resolve(categoryTreeData);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

/**
 * 获取基础库存同步
 */
export const getBasicStockValue = () => {
    return new Promise((resolve, reject) => {
        const dataJson = localStorage.getItem('basicStockValue');
        if (dataJson) {
            const data = JSON.parse(dataJson);
            resolve(data);
        }
        axios.post('/itemManage/getStockWarningInfo', null)
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
 * 更新基础类目
 * @param params
 * @returns
 */
export const updateStockWarningInfo = (params: StockWarningInfo[]) => {
    return new Promise((resolve, reject) => {
        axios.post('/itemManage/updateStockWarningInfo', params)
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve('error');
                }
                resolve('success');
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

/**
 * 删除指定类目预警值
 * @param params
 * @returns
 */
export const delStockWarningInfo = (params: string) => {
    return new Promise((resolve, reject) => {
        axios.post('/itemManage/delStockWarningInfo', params)
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve('error');
                }
                resolve('success');
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

/** 导出类目传入参数 */
interface ExportItemParams {
    spuIds?: string[];
    thirdCategoryId?: number;
    distributionState?: any;
    productName?: string;
}

/**
 * 导出商品数据
 */
export const exportItemData = (params: ExportItemParams) => {
    const { spuIds = [], thirdCategoryId, distributionState = [], productName } = params;
    // 拼接url
    const urlList = [];
    if (spuIds.length) {
        const spuArr = spuIds.map(item => `spuIds=${item}`);
        const spuStr = spuArr.join('&');
        urlList.push(spuStr);
    }
    if (thirdCategoryId) {
        urlList.push(`thirdCategoryId=${thirdCategoryId}`);
    }
    if (distributionState.length) {
        const distributionStateArr = distributionState.map((item: string) => `distributionState=${item}`);
        const data = distributionStateArr.join('&');
        urlList.push(data);
    }
    if (productName) {
        urlList.push(`productName=${productName}`);
    }
    const urlData = urlList.join('&');
    window.open(`${config.BASE_URL}/itemManage/exportItemData?${urlData}`);
    return 'success';
};

/**
 * 保存下架日志
 * @param params
 * @returns
 */
export const saveItemRemovedLog = (params: any) => {
    return new Promise((resolve, reject) => {
        axios.post('/itemManage/saveItemRemovedLog', params)
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve('error');
                }
                resolve('success');
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

