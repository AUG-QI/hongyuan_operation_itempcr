// @ts-ignore
import React from 'react';
import { Cascader } from 'antd';
import CommodityContent, { ItemsTableList } from './commodityContent';
import SelectPlatform from '../../components/selectPlatform';
import SearchInput from '../../components/searchInput';
import './index.scss';
import { getCategoryOptions, reqSearchCommodity } from './api';
import { numberRegular } from '../inventorySynchronous';

interface IProps {
}
interface IState {
    /** 类目选择 */
    categoryoptions: categoryoptions[];
    /** 商品列表 */
    itemTableList: ItemsTableList[];
    /** 搜索数据 */
    searchData: SearchData | any;
    /** 总数 */
    total: number;
    /** 类目信息 */
    categoryInfo: string;
    /** 商品页面加载 */
    shopManagementLoading: boolean;
    /** 是否刷新 */
    isRefresh: boolean;
    /** 页面展示 */
    pageFrom: string;
}

/** 类目选择项 */
interface categoryoptions {
    /** 商品id */
    categoryId?: string;
    /** 类目名称 */
    categoryName?: string;
    /** 子集 */
    children?: categoryoptions[];

}

/** 搜索内容 */
interface SearchData {
    /** 类目 */
    category: string[];
    /** 平台 */
    distributionState?: string[];
    /** 商品id */
    spuId?: number | string;
    /** 商品关键词搜索 */
    productName?: string;
    /** 每页条数 */
    pageNo: number;
    /** 页码 */
    pageSize: number;
}


/** 商品管理页面 */
class CommodityManagement extends React.Component<IProps, IState>  {
    constructor (props: IProps) {
        super(props);
        this.state = {
            categoryoptions: [],
            itemTableList: [],
            total: 0,
            searchData: {
                category: [],
                distributionState: ['all'],
                pageNo: 1,
                pageSize: 20,
            },
            categoryInfo: '',
            shopManagementLoading: true,
            isRefresh: false,
        };
    }
    componentDidMount (): void {
        // 初始化数据
        this.initData();
    }
    /**
     * 初始化数据
     */
    initData = async () => {
        const { searchData } = this.state;
        // 获取类目数据
        const categoryoptions: any = await getCategoryOptions();
        if (!categoryoptions.length) {
            this.setState({ shopManagementLoading: false });
            return;
        }
        // 设置默认数据 - 第一条数据
        let firstData: any = {
            data: [],
            name: [],
        };
        firstData = this.getFirstCategoryData(categoryoptions, firstData);
        this.setState({ categoryoptions, searchData: { ...searchData, category: firstData.data, categoryInfo: firstData.name } }, () => {
            this.handleSearch();
        });
    }

    /**
     * 获取第一个类目数据
     * @param categoryoptions
     * @param arr
     * @returns
     */
    getFirstCategoryData = (categoryoptions: any, firstData: any): string[] => {
        if (!categoryoptions.length) {
            return [];
        }
        categoryoptions?.forEach((item: any, index: number) => {
            if (index === 0) {
                firstData.data.push(item.categoryId);
                firstData.name.push(item.categoryName);
                if (item?.children) {
                    this.getFirstCategoryData(item.children, firstData);
                }
            }
        });
        return firstData;
    }

    /**
     * 处理类目改变
     * @param val
     */
    handleCategoryChange = (val: string[], data: any) => {
        const categoryInfo = this.getCategoryInfo(data);
        const { searchData } = this.state;
        searchData.category = val;
        this.setState({ searchData, categoryInfo }, () => {
            this.handleSearch();
        });
    }

    /**
     * 获取类目中文名称
     */
    getCategoryInfo = (data: any) => {
        const arr = data.map((item: any) => {
            return item.categoryName;
        });
        return arr.join('/');
    }

    /**
     * 处理平台改变
     * @param val
     */
    handlePlatformChange = (val : string[]) => {
        const { searchData } = this.state;
        // 处理选择所有平台的情况
        if (val.length === 1 && val[0] === 'all') {
            delete searchData.distributionState;
        } else {
            searchData.distributionState = val;
        }
        this.setState({ searchData }, () => {
            this.handleSearch();
        });
    }

    /**
     * 处理inputs搜索
     * @param val
     */
    handleInputSearch = (val: string) => {
        const { searchData } = this.state;
        // 判断是什么类型搜索
        if (numberRegular.test(val)) {
            searchData.spuId = val;
        } else {
            searchData.productName = val;
        }
        this.setState({ searchData }, () => {
            this.handleSearch();
        });
    }
    /**
     * 改变页码选项
     */
    handleChangePageSize = (val: number) => {
        const { searchData } = this.state;
        searchData.pageSize = val;
        this.setState({ searchData }, () => {
            this.handleSearch();
        });
    }

    /**
     * 真正开始处理搜索
     * @returns
     */
    handleSearch = async () => {
        const { searchData, shopManagementLoading } = this.state;
        if (!shopManagementLoading) {
            this.setState({ shopManagementLoading: true });
        }
        const reqData: any = {
            thirdCategoryId: searchData.category[searchData.category.length - 1] || 0,
            pageNo: searchData.pageNo,
            pageSize: searchData.pageSize,
        };
        if (searchData.spuId) {
            reqData.spuId = searchData.spuId;
        }
        if (searchData.productName) {
            reqData.productName = searchData.productName;
        }
        const { list, total } = await reqSearchCommodity(reqData);
        // 整理成能传入tablelist的文件 itemTableList
        const itemTableList = this.handleItemTableList(list);
        this.setState({ itemTableList, total, shopManagementLoading: false, isRefresh: true });
    }

    /**
     * 处理成table格式数据
     * @returns
     */
    handleItemTableList = (data: any) => {
        let tableData = [];
        const { categoryInfo } = this.state;
        tableData = data.map((item: any) => {
            return {
                ...item,
                categoryInfo,
            };
        });
        return tableData;
    }
    render () {
        const { categoryoptions, itemTableList, searchData, total, shopManagementLoading, isRefresh  } = this.state;
        return <div>
            {
                <div className='commodity-management'>
                    <div className="commodity-management-title location">
                        <Cascader
                            value={searchData.category}
                            options={categoryoptions}
                            // @ts-ignore
                            onChange={this.handleCategoryChange}
                            allowClear={false}
                            style={{ width: 324 }}
                            fieldNames={{ label: 'categoryName', value: 'categoryId' }}/>
                        <div className="title-input">
                            <SelectPlatform handleSelectChange={this.handlePlatformChange}></SelectPlatform>
                            <SearchInput from='productList' handleInputSearch={this.handleInputSearch}/>
                        </div>
                    </div>
                    <div className="commodity-management-content">
                        <CommodityContent itemTableList={itemTableList} total = {total} changePageSize={this.handleChangePageSize} searchData={searchData}  shopManagementLoading={shopManagementLoading} isRefresh={isRefresh}></CommodityContent>
                    </div>
                </div>
            }
        </div>;
    }
}

export default CommodityManagement;
