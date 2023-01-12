import { getCategoryOptions } from "../commodityManagement/api";

export interface DefaultSearchData {
    pageSize: number;
    pageNo: number;
}
/** 获取初始化搜索cids */
const findSonByRecursion = (selectList: any, cids: string[]): string[] => { // 递归树查找最底层的类目
    selectList.forEach((item: any) => {
        if (item.children) {
            findSonByRecursion(item.children, cids);
        } else {
            cids.push(item.categoryId);
        }
    });
    return cids;
};

/** 获取主类目id里面的cid */
export const getDefaultCids = async (id: number): Promise<string[]> => {
    const categoryoptions: any = await getCategoryOptions();
    if (!categoryoptions.length) {
        return [];
    }
    const defaultData = categoryoptions.filter((item: any) => item.categoryId === id);
    const cids: any = [];
    return findSonByRecursion(defaultData, cids);
};
