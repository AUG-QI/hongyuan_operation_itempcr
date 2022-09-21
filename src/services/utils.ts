/*
 * @Author: 二齐 1321703149@qq.com
 * @Date: 2022-09-09 03:33:52
 * @LastEditors: 二齐 1321703149@qq.com
 * @LastEditTime: 2022-09-21 20:48:46
 * @FilePath: /simple-react-0909/src/services/utils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
export function isEmpty(obj: any): obj is undefined | null | '' {
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
export const transformationObject = (url): UrlData => {
    if(isEmpty(url.split("?")[1])) return null;
        let str = url;
        let paramArr = str.split('?');
        let arr= paramArr[1].split('&')
        let obj = {};
        for(let i = 0;i<arr.length;i++) {
            let tmp_arr = arr[i].split("=");
            obj[tmp_arr[0]] = tmp_arr[1];
        }
    return obj;
  }
export const NOOP = () => {};
