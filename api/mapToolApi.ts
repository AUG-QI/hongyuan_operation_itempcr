
import config from "../src/config";
import axios from "../src/services/axios";

/**
 * 平台地址查询接口
 * @returns
 */
export const getMultiPlatformAddress = (params: any): Promise<any> => {
    params.ay_token = 'SFRUUF9BWV9UT0tFTg==';
    const formData = new FormData();
    for (const key in params) {
        formData.append(key, params[key]);
    }
    return new Promise((resolve, reject) => {
        axios.post('iytrade2/getMultiPlatform', formData, {
            baseURL: config.PHP_URL,
        })
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

interface AddMultiPlatformAddressParams {
    /** 省 */
    provinceName: string;
    /** 省编码 */
    provinceCode: string;
    /** 市 */
    cityName: string;
    /** 市编码 */
    cityCode: string;
    /** 区 */
    areaName: string;
    /** 区编码 */
    areaCode: string;
    /** 平台 */
    platform: string;
}
/**
 * 添加多平台数据
 * @returns
 */
export const addMultiPlatformAddress = (params: any): Promise<any> => {
    params.ay_token = 'SFRUUF9BWV9UT0tFTg==';
    const formData = new FormData();
    for (const key in params) {
        formData.append(key, params[key]);
    }
    return new Promise((resolve, reject) => {
        axios.post('iytrade2/addMultiPlatformAddress', formData, {
            baseURL: config.PHP_URL,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
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
 * 添加多平台数据
 * @returns
 */
export const editMultiPlatformAddress = (params: any): Promise<any> => {
    params.ay_token = 'SFRUUF9BWV9UT0tFTg==';
    const formData = new FormData();
    for (const key in params) {
        formData.append(key, params[key]);
    }
    return new Promise((resolve, reject) => {
        axios.post('iytrade2/editMultiPlatformAddress', formData, {
            baseURL: config.PHP_URL,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
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
 * 修改平台数据绑定关系
 * @returns
 */
export const editMultiPlatformAddressBind = (params: any): Promise<any> => {
    params.ay_token = 'SFRUUF9BWV9UT0tFTg==';
    const formData = new FormData();
    for (const key in params) {
        formData.append(key, params[key]);
    }
    return new Promise((resolve, reject) => {
        axios.post('iytrade2/editMultiPlatformAddressBind', formData, {
            baseURL: config.PHP_URL,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
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
 * 删除平台数据
 * @returns
 */
export const delMultiPlatformAddress = (params: any): Promise<any> => {
    params.ay_token = 'SFRUUF9BWV9UT0tFTg==';
    const formData = new FormData();
    for (const key in params) {
        formData.append(key, params[key]);
    }
    return new Promise((resolve, reject) => {
        axios.post('iytrade2/delMultiPlatformAddress', formData, {
            baseURL: config.PHP_URL,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
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
 * 查询类目映射
 * @returns
 */
export const searchCatsMapping = (params: any): Promise<any> => {
    return axios.post('/itemManage/searchCatsMapping', params)
        .then((response: any) => {
            if (response.code !== 200) {
                return [];
            }
            return response.data || [];
        });
};
/** 查询爱用类目 */
export const searchAyCats = (params: any) => {
    return axios.post('/itemManage/searchAyCats', params)
        .then((response: any) => {
            if (response.code !== 200) {
                return [];
            }
            return response.data;
        });
};
/** 查询三方平台类目 */
export const searchPlatformCats = (params: any) => {
    return axios.post('/itemManage/searchPlatformCats', params)
        .then((response: any) => {
            if (response.code !== 200) {
                return [];
            }
            return response.data;
        });
};
/** 更新平台类目 */
export const changeCats = (params: any) => {
    return axios.post('/itemManage/changeCats', params)
        .then((response: any) => {
            if (response.code !== 200) {
                return 'error';
            }
            return response.data;
        });
};
/** 新增爱用类目 */
export const addAyCats = (params: any) => {
    return axios.post('/itemManage/addAyCats', params)
        .then((response: any) => {
            if (response.code !== 200) {
                return response.message;
            }
            return 'success';
        });
};
/** 新增爱用类目 */
export const setPropsDefaultValue = (params: any) => {
    return axios.post('/itemManage/setPropsDefaultValue', params)
        .then((response: any) => {
            if (response.code !== 200) {
                return [];
            }
            return response.data;
        });
};
/** 新增爱用类目 */
export const getPropDefaultValue = (params: any) => {
    return axios.post('/itemManage/getPropDefaultValue', params)
        .then((response: any) => {
            if (response.code !== 200) {
                return [];
            }
            return response.data;
        });
};
