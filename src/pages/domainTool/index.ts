
import { storeId_params } from "../operationLog/component/logSearch";

/** 映射工具表头 */
export const DomainToolTableTitle = [
    {
        value: 'parent_cnames',
        name: '必要类目',
    },
    {
        value: 'platform_prop_name',
        name: '必要属性',
    },
    {
        value: 'platform_prop_id',
        name: '必要值域ID',
    },
    {
        value: 'platform_prop_value_name',
        name: '必要值域名字',
    },
    {
        value: 'ay_vids',
        name: '爱用值域名字',
    },
    {
        value: 'platforms',
        name: '需映射平台',
    },
];
export const platforms_Map = {
    KWAISHOP: '快',
    DOUDIAN: '抖',
    BIYAO: '必',
    YOUZAN: '赞',
    WXVIDEOSHOP: '视',
};
/** 找key */
export const findKey = (value: string, compare = (item1: string, item2: string) => item1 === item2) => {
    return Object.keys(storeId_params).find(key => compare(storeId_params[key], value));
};
