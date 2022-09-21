
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
    searchData: SearchData;
    /** 总数 */
    total: number;
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
        // 设置默认数据 - 第一条数据
        const firstData: string[] = [];
        const category = this.getFirstCategoryData(categoryoptions, firstData);
        this.setState({ categoryoptions, searchData: { ...searchData, category } }, () => {
            this.handleSearch();
        });
    }

    /**
     * 获取第一个类目数据
     * @param categoryoptions
     * @param arr
     * @returns
     */
    getFirstCategoryData = (categoryoptions: any, arr: string[]): string[] => {
        if (!categoryoptions.length) {
            return [];
        }
        categoryoptions?.forEach((item: any, index: number) => {
            if (index === 0) {
                arr.push(item.categoryId);
                if (item?.children) {
                    this.getFirstCategoryData(item.children, arr);
                }
            }
        });
        return arr;
    }

    /**
     * 处理类目改变
     * @param val
     */
    handleCategoryChange = (val: string[]) => {
        const { searchData } = this.state;
        searchData.category = val;
        this.setState({ searchData }, () => {
            this.handleSearch();
        });
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
        // 去空
        const inputValue = val.trim();
        if (!inputValue) {
            return;
        }
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
        const { searchData } = this.state;
        const { list, total } = await reqSearchCommodity(searchData);
        // 整理成能传入tablelist的文件 itemTableList
        const itemTableList = this.handleItemTableList(list);
        this.setState({ itemTableList, total });
    }

    /**
     * 处理成table格式数据
     * @returns
     */
    handleItemTableList = (data: any) => {
        let tableData = [];
        tableData = data.map(item => {
            return {
                name: item.productName,
                url: item.portalSquareImgUrl,
                key: item.spuId,
                category: item.salePoint,
                liangdao: '',
            };
        });
        return tableData;
    }
    render () {
        const { categoryoptions, itemTableList, searchData, total  } = this.state;
        return <div className='commodity-management'>
            <div className="commodity-management-title location">
                <Cascader
                    value={searchData.category}
                    options={categoryoptions}
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
                <CommodityContent itemTableList={itemTableList} total = {total} changePageSize={this.handleChangePageSize}></CommodityContent>
            </div>
        </div>;
    }
}

export default CommodityManagement;
