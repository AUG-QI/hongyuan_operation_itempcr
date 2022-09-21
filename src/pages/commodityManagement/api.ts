import moment from '_moment@2.29.4@moment';
import axios from '../../services/axios';

interface CategoryData {
    categoryId?: number;
    categoryName?: string;
    children?: CategoryData[];
}
/**
 * 请求获取商品列表
 */
export const reqSearchCommodity = (params: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post('/itemManage/getItemList', params)
            .then((response) => {
                const res = response.data.data;
                resolve(res);
            })
            .catch((error) => {
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
    //  删除所有 children,以防止多次调用
    arr.forEach((item: CategoryData) => {
        delete item.children;
    });
    const map: any = {}; // 构建map
    arr.forEach(i => {
        map[i.categoryId] = i; // 构建以area_id为键 当前数据为值
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
    shop_type: string;
    /** 销商关键词搜索 */
    key_word: string;
    /** 货源商品id */
    origin_num_iid: string;
    /** 页码 */
    page_no: number;
    /** 页面大小 */
    page_size: number;

}
const ITEM_LIST_URL = 'Distributeitem/getItemListByOriginNumIid';
/**
 * 分销商列表搜索接口
 */
export const reqSearchDistributorList = (params: DistributorParams): Promise<any> => {
    // const { shop_type, key_word, origin_num_iid, page_no, page_size } = params;
    return new Promise((resolve, reject) => {
        axios.get(`${ITEM_LIST_URL}?origin_num_iid=1300185001060300000`, {
            baseURL: 'https://devweb1688.aiyongtech.com',
            headers: { 'X-From-App': 'biyao' },
        })
            .then(response => {
                // if (response.data.code === '4005') {
                //     window.localStorage.clear();
                //     location.reload()
                // }
                resolve(response.data);
            }, err => {
                reject(err);
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
export const getCategoryOptions = () => {
    return new Promise((resolve, reject) => {
        const nowDate = moment().format('YY-MM-DD');
        const dataJson = sessionStorage.getItem('categoryOptions');
        if (dataJson) {
            const data = JSON.parse(dataJson);
            // 同一天获取
            if (data.storageDate == nowDate) {
                // 处理一下数据再返回
                const categoryTreeData = setTreeData(data.categoryData);
                return Promise.resolve(categoryTreeData);
            }
        }
        axios.post('/itemManage/getCategoryList', null)
            .then((response) => {
                console.log(response, '????response');
                
                if (response.code !== 200) {
                    resolve([]);
                }
                const categoryData = response.data.data.data;
                const categoryOptions = {
                    storageDate: nowDate,
                    categoryData,
                };
                // 做个缓存
                localStorage.setItem('categoryOptions', JSON.stringify(categoryOptions));
                const categoryTreeData = setTreeData(categoryData);
                resolve(categoryTreeData);
            })
            .catch((error) => {
                console.log(error);
            });
    });
};
