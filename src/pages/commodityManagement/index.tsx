import React, { ChangeEvent } from 'react';
import { Cascader, message, Space, Table } from 'antd';
import SelectPlatform, { PLATFORM_IMG } from '../../components/selectPlatform';
import SearchInput from '../../components/searchInput';
import './index.scss';
import { exportItemData, getCategoryOptions, reqSearchCommodity } from './api';
import { numberRegular } from '../inventorySynchronous';
import FooterPage from '../../components/footerPage';
import { NavLink } from 'react-router-dom';

interface IProps {
}

export interface ItemsTableList {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    description: string;
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
    /** rowSelection */
    rowSelection: any;
    /** 是否全选 */
    isAllValue: boolean;
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
                inputVal: '',
            },
            categoryInfo: '',
            shopManagementLoading: true,
            rowSelection: {
                onChange: this.changeTableSelectedState,
                selectedRowKeys: [], // 选中的值
                hideSelectAll: true,
            },
            isAllValue: false,
        };
    }
    async componentDidMount () {
        const searchDataJson = sessionStorage.getItem('commoditySearchData');
        if (searchDataJson) {
            const categoryoptions: any = await getCategoryOptions();
            const searchData = JSON.parse(searchDataJson);
            this.setState({ searchData, categoryInfo: searchData.categoryInfo, categoryoptions }, () => {
                this.handleSearch();
            });
            return;
        }
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
     * 获取表头
     * @returns
     */
    getColumns = () => {
        return [
            {
                title: '商品信息',
                dataIndex: 'productName',
                width: 300,
                key: 'productName',
                render: (name: any, record: any) => (
                    <Space size="middle">
                        <div className="productInfo">
                            <div className="productInfo-img">
                                <img
                                    src={record.portalSquareImgUrl}
                                    alt=""
                                    onError={(event: ChangeEvent<any>) => {
                                        event.target.onerror = null;
                                        event.target.src =
                                            'https://q.aiyongtech.com/biyao/imgs/error_img.jpeg';
                                    }}
                                />
                            </div>
                            <div>
                                <div className="productInfo-name">
                                    {record.productName}
                                </div>
                                <div className="productInfo-id">
                                    ID:{record.spuId}
                                </div>
                            </div>
                        </div>
                    </Space>
                ),
            },
            {
                title: '类目',
                dataIndex: 'categoryInfo',
                key: 'categoryInfo',
                align: 'center',
            },
            {
                title: '渠道',
                dataIndex: 'distributionState',
                key: 'distributionState',
                width: 150,
                align: 'center',
                render: (name: any, record: any) => (
                    <Space size="middle">
                        <div className="distribution-state">
                            {record.doudianDistributionState === 1 ? (
                                <img src={PLATFORM_IMG['doudian']} alt="" />
                            ) : (
                                <img src={PLATFORM_IMG['doudianGray']} alt="" />
                            )}
                            {record.youzanDistributionState === 1 ? (
                                <img src={PLATFORM_IMG['youzan']} alt="" />
                            ) : (
                                <img src={PLATFORM_IMG['youzanGray']} alt="" />
                            )}
                        </div>
                    </Space>
                ),
            },
            {
                title: '操作',
                align: 'center',
                dataIndex: 'operation',
                fixed: 'right',
                render: (name: any, record: any) => (
                    <Space size="middle">
                        <NavLink
                            to={{ pathname: `/commodityManagement/list?id=${record.spuId}` }}
                        >
                            已铺货店铺管理
                        </NavLink>
                    </Space>
                ),
            },
        ];
    };

    /**
     * 改变表格选中状态
     * @param val
     */
    changeTableSelectedState = (val: string[]) => {
        const { rowSelection, itemTableList } = this.state;
        rowSelection.selectedRowKeys = val;
        if (val.length !== itemTableList.length) {
            this.setState({ isAllValue: false });
        } else {
            this.setState({ isAllValue: true });
        }
    };
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
        searchData.pageNo = 1;
        searchData.distributionState = ['all'];
        searchData.inputVal = '';
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
        searchData.distributionState = val;
        searchData.pageNo = 1;
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
        searchData.inputVal = val;
        searchData.pageNo = 1;
        this.setState({ searchData }, () => {
            this.handleSearch();
        });
    }
    /**
     * 处理改变input输入
     * @param val
     */
    handleChangeInputVal = (val: string) => {
        const { searchData } = this.state;
        searchData.inputVal = val;
        this.setState({ searchData });
    }
    /**
     * 改变页码选项
     */
    handleChangePageSize = (val: number) => {
        const { searchData } = this.state;
        searchData.pageNo = val;
        this.setState({ searchData }, () => {
            this.handleSearch();
        });
    }

    /**
     * 真正开始处理搜索
     * @returns
     */
    handleSearch = async () => {
        const { searchData, shopManagementLoading, categoryInfo, rowSelection  } = this.state;
        // 保存一下搜索参数
        sessionStorage.setItem('commoditySearchData', JSON.stringify({ ...searchData, categoryInfo }));
        if (!shopManagementLoading) {
            this.setState({ shopManagementLoading: true });
        }
        const reqData: any = {
            thirdCategoryId: searchData.category[searchData.category.length - 1] || 0,
            pageNo: searchData.pageNo,
            pageSize: searchData.pageSize,
        };
        // 处理搜索数据
        // 如果是所有平台就不用传了
        if (searchData.distributionState[0] !== 'all') {
            reqData.distributionState = searchData.distributionState;
        }
        const inputVal = searchData.inputVal.trim();
        if (inputVal && numberRegular.test(inputVal)) {
            reqData.spuId = inputVal;
        } else if (inputVal) {
            reqData.productName = searchData.inputVal;
        }
        const { list, total } = await reqSearchCommodity(reqData);
        // 整理成能传入tablelist的文件 itemTableList
        const itemTableList = this.handleItemTableList(list);
        // 清空状态
        rowSelection.selectedRowKeys = [];
        this.setState({ itemTableList, total, shopManagementLoading: false, rowSelection, isAllValue: false });
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
    /**
     * 全选
     * @returns
     */
    handelSelectAll = (isAllValue: boolean) => {
        const { rowSelection, itemTableList } = this.state;
        if (!isAllValue) {
            rowSelection.selectedRowKeys = [];
        } else {
            rowSelection.selectedRowKeys = itemTableList.map((item: any) => item.spuId);
        }
        this.setState({ isAllValue, rowSelection });
    }

    /**
     * 处理导出按钮
     * @param type 
     * @returns 
     */
    handelOperationBtn = (type: string) => {
        // 导出全部
        if (type === 'exportItemsAll') {
            const { total } = this.state;
            if (total < 1) {
                return message.warning('暂无数据导出');
            }
            this.handelExportItems();
        } else if (type === 'exportItemSelected') {
            // 导出选中
            const { rowSelection } = this.state;
            if (!rowSelection.selectedRowKeys.length) {
                return message.warning('请先勾选商品');
            }
            this.handelExportItems(rowSelection.selectedRowKeys);
        }
    }
    /**
     * 上传后回调
     */
    filetUploadCallback = (status: string) => {
        if (status !== 'success') {
            return;
        }
        this.handleSearch();
    }

    /**
     * 开始处理选择的导出商品
     */
    handelExportItems = async (spuIdArr = []) => {
        const { searchData } = this.state;
        const thirdCategoryId =
            searchData.category[searchData.category.length - 1];
        // 部分导出或者直接是id搜索 直接传选择的+类目
        if (spuIdArr.length || (searchData.inputVal && numberRegular.test(searchData.inputVal))) {
            const spuIds = spuIdArr.length ? spuIdArr : searchData.inputVal.trim().split();
            // 导出选中
            await exportItemData({ spuIds, thirdCategoryId });
        } else {
            // 全部就需要传搜索条件
            const data: any = {};
            // 三级类目
            data.thirdCategoryId = thirdCategoryId;
            if (!searchData.distributionState.includes('all')) {
                data.distributionState = searchData.distributionState;
            }
            if (searchData.inputVal && searchData.inputVal.trim()) {
                data.productName = searchData.inputVal;
            }
            await exportItemData(data);
        }
    };
    render () {
        const { categoryoptions, itemTableList, searchData, total, shopManagementLoading, isAllValue, rowSelection  } = this.state;
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
                            <SelectPlatform handleSelectChange={this.handlePlatformChange} distributionState={searchData.distributionState}></SelectPlatform>
                            <SearchInput from='productList' handleInputSearch={this.handleInputSearch} inputVal={searchData.inputVal} handleChangeInputVal={this.handleChangeInputVal}/>
                        </div>
                    </div>
                    <div className="commodity-management-content">
                        <div className="shop-management">
                            <Table
                                // @ts-ignore
                                columns={this.getColumns()}
                                dataSource={itemTableList}
                                pagination={false}
                                rowSelection={rowSelection}
                                scroll={{
                                    y: 1000,
                                }}
                                rowKey="spuId"
                                loading={shopManagementLoading}
                                ellipsis
                            />
                            <FooterPage
                                handelSelectAll={this.handelSelectAll}
                                changePageSize={this.handleChangePageSize}
                                handelOperationBtn={this.handelOperationBtn}
                                pageNo = {searchData.pageNo}
                                isAllValue={isAllValue}
                                from="productList"
                                total={total}
                                filetUploadCallback={this.filetUploadCallback}
                                selectNum={rowSelection.selectedRowKeys.length}
                            ></FooterPage>
                        </div>
                    </div>
                </div>
            }
        </div>;
    }
}

export default CommodityManagement;
