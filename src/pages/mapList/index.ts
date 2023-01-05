
/** 必要代补属性选项 */
export const biyaoWaitingSupplementOptions = [
    {
        value: 0,
        label: '所有属性',
    },
    {
        value: 1,
        label: '必要未映射属性',
    },
    {
        value: 2,
        label: '必要需替换属性',
    },
];
/** 必要值域属性选项 */
export const biyaoMapDomainOptions = [
    {
        value: false,
        label: '所有值域',
    },
    {
        value: true,
        label: '必要未映射值域',
    },
];
/** 是否自定义选项 */
export const customizeOptions = [
    {
        value: '1',
        label: '可自定义',
    },
    {
        value: '2',
        label: '不可自定义',
    },
];
/** 属性类型选项 */
export const attributeTypeOptions = [
    {
        value: 'TEXT',
        label: '文本',
    },
    {
        value: 'IMAGE',
        label: '图片',
    },
    {
        value: 'SELECT',
        label: '单选',
    },
    {
        value: 'MULTI_SELECT',
        label: '多选',
    },
];
/** 映射工具表头 */
export const MapToolTableTitle = [
    {
        value: 'parent_cnames',
        name: '必要类目',
    },
    {
        value: 'platform_prop_id',
        name: '必要属性ID',
    },
    {
        value: 'ay_prop_value_name',
        name: '必要属性名字',
    },
    {
        value: 'ay_prop_name',
        name: '爱用属性名字',
    },
    {
        value: 'custom_flag',
        name: '自定义',
    },
    {
        value: 'type',
        name: '类别',
    },
    {
        value: 'caozuo',
        name: '操作',
    },
];
/** 找到最底层类目 */
export const findSonByRecursion = (selectList: any, cids: string[]): string[] => { // 递归树查找最底层的类目
    selectList.forEach((item: any) => {
        if (item.children) {
            findSonByRecursion(item.children, cids);
        } else {
            cids.push(item.categoryId);
        }
    });
    return cids;
};
/** 默认的类目categoryId */
export const DEFAULT_CATEGORY = 70;
