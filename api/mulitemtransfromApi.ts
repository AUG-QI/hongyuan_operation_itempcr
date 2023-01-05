/** 类目属性&值域匹配工具api  */

import axios from "../src/services/axios";

/** 默认参数 */
interface DefaultParams {
    /** 页码 */
    page_no: number;
    /** 页数 */
    page_size: number;
}

interface GetPropsMapListParmas {
    /** 查询平台 */
    platform?: 'BIYAO';
    /** 叶子类目cid串 */
    cids: string;
    /** 是否只展示为匹配数据 */
    show_not_match?: boolean;
    /** 是否支持自定义
        1 支持
        2 不支持 */
    custom_flag?: number;
    /** 属性名称筛选  */
    pname?: string;
}
/**
 * 获取类目属性匹配列表
 * @returns
 */
export const getPropsMapList = (params: GetPropsMapListParmas & DefaultParams): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/getPropsMapList', { ...params })
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

interface PullPropsValuesMapDataParmas {
    /** 叶子类目cid */
    cids: string;
}
/**
 * 拉取下游平台的的属性以及值域数据并进行基本匹配
 * @returns
 */
export const pullPropsValuesMapData = (params: PullPropsValuesMapDataParmas): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/pullPropsValuesMapData', { ...params })
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
 * 查询同步属性任务进度
 * @returns
 */
export const getPropsMapTaskProgress = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/getPropsMapTaskProgress', {})
            .then((response: any) => {
                if (response.code !== 200) {
                    resolve('同步任务失败');
                }
                // 没有同步任务
                if (!response.data || !response.data?.progress) {
                    resolve('none');
                }
                resolve(response.data);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

interface GetPvaluesMapListParmas {
    /** 叶子类目cid串 */
    cids: string;
    /** 是否只展示为匹配数据 */
    show_not_match?: boolean;
    /** 属性值域名称筛选 */
    vname?: string;
}
/**
 * 获取属性值域匹配列表
 * @returns
 */
export const getPvaluesMapList = (params: GetPvaluesMapListParmas & DefaultParams): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/getPvaluesMapList', { ...params })
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

interface SetPropsBindRelationParmas {
    /** 需要绑定的数据 */
    set_props_data: string;
    /** 匹配属性的爱用类目ID */
    ay_cid: string;
    /** 选择匹配的爱用属性ID */
    ay_prop_id: string;
    /** 选择匹配的爱用属性名称 */
    ay_prop_name: string;
    /** 进行匹配的必要平台的属性ID */
    platform_prop_id: string;
    /** 进行匹配的上游平台的属性名称 */
    platform_prop_name: string;
}
/**
 * 批量设置属性绑定关系
 * @returns
 */
export const setPropsBindRelation = (setPropsData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/setPropsBindRelation', { setPropsData })
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

interface SearchPropNameParmas {
    cids: string;
    /** 搜索的下游平台属性ID */
    platformPropId: string;
}
/**
 * 搜索选中的类目中根据下游平台的pid搜索属性信息
 * @returns
 */
export const searchPropName = (params: SearchPropNameParmas): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/searchPropName', { ...params })
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

interface SetPvaluesBindRelationParmas {
    /** 爱用类目ID */
    ay_cid: string;
    /** 爱用属性ID */
    ay_prop_id:	string;
    /** 上游平台对应爱用值域ID */
    ay_prop_value_id: string;
    /** 上游平台对应爱用值域名称 */
    ay_prop_value_name: string;
    /** 上游平台值域ID */
    platform_prop_value_id: string;
    /** 上游平台值域名称 */
    platform_prop_value_name: string;
    /** 设置的匹配爱用值域数据 */
    set_pvalues: SetPvalues[];
}
interface SetPvalues {
    /** 修改匹配的爱用值域ID */
    set_ay_prop_value_id: string;
    /** 修改匹配的爱用值域名称 */
    set_ay_prop_value_name: string;
}
/**
 * 搜索选中的类目中根据下游平台的pid搜索属性信息
 * @returns
 */
export const setPvaluesBindRelation = (setPvaluesData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/setPvaluesBindRelation', { setPvaluesData })
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

interface SyncPvaluesRelationParmas {
    /** 选择同步到的类目ID */
    cids: string;
    sync_pvalues: SyncPvalues[];
}
interface SyncPvalues {
    /** 上游平台属性值域名称 */
    platform_prop_value_name: string;
    /** 映射到爱用的值域名称 */
    map_vnames: string[];
}
/**
 * 同步值域关联关系到其他类目
 * @returns
 */
export const syncPvaluesRelation = (params: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('itemManage/syncPvaluesRelation', { ...params })
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
