export type AnyCallback = (...args: any[]) => any;

/** 定义 window 对象 */
declare global {
    interface Window {
        userInfo: any;
        is_ssr: boolean;
    }
}
