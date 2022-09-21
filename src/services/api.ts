import { AnyCallback } from './types';
import { isEmpty, NOOP } from './utils';

export const enum BODY_CONTENT_TYPE {
    JSON = 'JSON',
    FORM_DATA = 'FORM_DATA',
}

export function buildArgs(obj: any): string {
    return Object.keys(obj)
        .map((key) => `${key}=${obj[key]}`)
        .join('&');
}

export function buildFormData(formData: FormData, body: any, keys: any[] = []) {
    for (const i in body) {
        if (typeof body[i] === 'object') {
            const newkeys: string[] = [...keys];
            if (newkeys.length > 0) {
                newkeys[0] = `${newkeys[0]}[${i}]`;
            } else {
                newkeys.push(i);
            }
            buildFormData(formData, body[i], newkeys);
        } else {
            let key = '';
            keys.map((c) => {
                isEmpty(key) ? (key = c) : (key += `[${c}]`);
            });
            isEmpty(key)
                ? formData.append(i, body[i])
                : formData.append(`${key}[${i}]`, body[i]);
        }
    }
    return formData;
}

export const enum HTTP_REQUEST_METHODS {
    'GET' = 'GET',
    'POST' = 'POST',
    'DELETE' = 'DELETE',
    'PATCH' = 'PATCH',
}

export interface ApiArgs {
    host?: string;
    route?: string;
    method?: string;
    args?: any;
    body?: any;
    query?: any;
    options?: object;
    callback?: AnyCallback;
    errCallback?: AnyCallback;
    httpMethod?: HTTP_REQUEST_METHODS;
    apiName?: string;
    mode?: 'json' | 'jsonp';
    bodyContentType?: BODY_CONTENT_TYPE;
    noMonitor?: boolean;
    autoAddBasicArgs?: boolean;
    waitDeferred?: boolean;
}

let globalRequestId = 0;

/**
 * 统一请求
 */
export async function api({
    host = '//trade.aiyongtech.com',
    method = '',
    args,
    body,
    bodyContentType = BODY_CONTENT_TYPE.FORM_DATA,
    options = {},
    callback = NOOP,
    errCallback = NOOP,
    mode = 'json',
    noMonitor = false,
    httpMethod = HTTP_REQUEST_METHODS.POST,
    waitDeferred = true,
}: ApiArgs): Promise<void> {
    host = host?.replace(/^\/\//, 'https://');
    if (!isEmpty(args)) {
        body = { ...body, ...args };
        args = {};
    }
    const init: RequestInit = {
        method: httpMethod,
        ...options,
        credentials: 'include',
    };
    if (
        (httpMethod == HTTP_REQUEST_METHODS.POST ||
            httpMethod == HTTP_REQUEST_METHODS.PATCH) &&
        body
    ) {
        switch (bodyContentType) {
            case BODY_CONTENT_TYPE.JSON:
                init.body = JSON.stringify(body);
                break;
            case BODY_CONTENT_TYPE.FORM_DATA:
                init.body = buildFormData(new FormData(), body);
                break;
        }
    }

    let url = host + method;
    const startTime = window.performance.now();
    if (!isEmpty(args)) {
        url += `?${buildArgs(args)}`;
    }
    let isSuccess = false;

    const requestId = globalRequestId;
    globalRequestId++;

    window
        .fetch(url, init)
        .then((res) => {
            return res.json();
        })
        .then((response) => {
            isSuccess = true;
            if (response.code > 400) {
                if (
                    response.code == 401 &&
                    response.message === '缺少授权信息, 缺少nick'
                ) {
                    // 处理请求java接口登录失效的问题
                    // showLoginExpiredDialog();
                }
                // apiErrorCollect({ message: response.message || response.msg, content: JSON.stringify(response), apiName: method });
                return errCallback(response);
            }

            callback(response);
        })
        .catch((err) => {
            if (!isSuccess) {
                if (err.code == '500' && err.sub_code == '20003') {
                    // showLoginExpiredDialog();
                }
                errCallback(err);
            } else {
                console.error(err);
            }
        });
}
