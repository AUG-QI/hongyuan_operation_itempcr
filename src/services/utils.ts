/**
 * 去掉前后 空格/空行/tab 的正则 预先定义 避免在函数中重复构造
 * @type {RegExp}
 */
const trimReg = /(^\s*)|(\s*$)/g;

/** url里面的数据 */
export interface UrlData {
    id: string;
}
/**
 * 判断一个东西是不是空 空格 空字符串 undefined 长度为0的数组及对象会被认为是空的
 * @param obj
 * @returns {boolean}
 */
export function isEmpty (obj: any): obj is undefined | null | '' {
    if (obj === undefined || obj === '' || obj === null) {
        return true;
    }
    if (typeof obj === 'string') {
        obj = obj.replace(trimReg, '');
        if (
            obj == '' ||
            obj == null ||
            obj == 'null' ||
            obj == undefined ||
            obj == 'undefined'
        ) {
            return true;
        }
        return false;
    } else if (typeof obj === 'undefined') {
        return true;
    } else if (typeof obj === 'object') {
        for (const value in obj) {
            return false;
        }
        return true;
    } else if (typeof obj === 'boolean') {
        return false;
    }
    return false;
}

/**
 * 获取拼接地址url
 */
export const transformationObject = (url: string): any => {
    if (isEmpty(url.split("?")[1])) return null;
    const str = url;
    const paramArr = str.split('?');
    const arr = paramArr[1].split('&');
    const obj: any = {};
    for (let index: number = 0; index < arr.length; index++) {
        const tmp_arr = arr[index].split("=");
        obj[tmp_arr[0]] = tmp_arr[1];
    }
    return obj;
};

