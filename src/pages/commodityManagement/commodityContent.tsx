import { message, Space, Table } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { TableRowSelection } from 'antd/es/table/interface';
import FooterPage from '../../components/footerPage';
import { exportItemData } from './api';
import { PLATFORM_IMG } from '../../components/selectPlatform';

export interface ItemsTableList {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    description: string;
}

interface IProps {
    /** 商品列表 */
    itemTableList: ItemsTableList[];
    /** 翻页 */
    changePageSize: Function;
    /** 总数 */
    total: number;
    /** 搜索参数 */
    searchData: any;
    /** 商品管理加载效果 */
    shopManagementLoading: boolean;
}

interface IState {
    /** 是否全选 */
    isAllValue: boolean;
    /** rowSelection */
    rowSelection: TableRowSelection<ItemsTableList>;
}

/** 商品列表内容页面 */
class CommodityContent extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            rowSelection: {
                onChange: this.changeTableSelectedState,
                selectedRowKeys: [], // 选中的值
                hideSelectAll: true,
            },
            isAllValue: false,
        };
    }
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (this.props.total !== prevProps.total) {
            const { rowSelection } = this.state;
            const initRowSelection = {
                ...rowSelection,
                selectedRowKeys: [],
            }
            this.setState({ isAllValue: false, rowSelection: initRowSelection });
        }
    }
    /**
     * 改变表格选中状态
     * @param val
     */
    changeTableSelectedState = (val: string[]) => {
        const { itemTableList } = this.props;
        const { rowSelection } = this.state;
        rowSelection.selectedRowKeys = val;
        if (val.length !== itemTableList.length) {
            this.setState({ isAllValue: false });
        } else {
            this.setState({ isAllValue: true });
        }
    };

    /**
     * 全选
     * @return
     */
    handelSelectAll = (val: boolean) => {
        const { itemTableList } = this.props;
        const { rowSelection } = this.state;
        if (!val) {
            rowSelection.selectedRowKeys = [];
        } else {
            rowSelection.selectedRowKeys = itemTableList.map((item) => item.spuId);
        }
        this.setState({ isAllValue: val, rowSelection });
    };

    /**
     * 改变页码
     * @returns
     */
    changePageSize = (val: number) => {
        const { changePageSize } = this.props;
        changePageSize(val);
    };

    /** 点击操作按钮 */
    handelOperationBtn = (type: string) => {
        // 导出全部
        if (type === 'exportItemsAll') {
            const { total } = this.props;
            if (total < 1) {
                return message.info('暂无数据导出');
            }
            this.handelExportItems();
        } else if (type === 'exportItemSelected') {
            // 导出选中
            const { rowSelection } = this.state;
            if (!rowSelection.selectedRowKeys.length) {
                return message.info('请先勾选商品');
            }
            this.handelExportItems(rowSelection.selectedRowKeys);
        }
    };
    /**
     * 处理导出商品
     */
    handelExportItems = async (spuIds = []) => {
        const { searchData } = this.props;
        const thirdCategoryId =
            searchData.category[searchData.category.length - 1];
        if (spuIds.length || searchData.spuIds) {
            // 导出选中
            await exportItemData({ spuIds, thirdCategoryId });
        } else {
            const { searchData } = this.props;
            const data = {};
            // 三级类目
            data.thirdCategoryId = thirdCategoryId;
            if (searchData.distributionState[0] !== 'all') {
                data.distributionState = searchData.distributionState;
            }
            if (searchData.productName) {
                data.distributionState = searchData.productName;
            }
            await exportItemData(data);
        }
    };
    /**
     * 获取表头
     * @returns
     */
    getColumns = () => {
        return [
            {
                title: '商品信息',
                dataIndex: 'productName',
                width: 400,
                key: 'productName',
                render: (_, record) => (
                    <Space size="middle">
                        <div className="productInfo">
                            <div className="productInfo-img">
                                <img
                                    src={record.portalSquareImgUrl}
                                    alt=""
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
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
            },
            {
                title: '渠道',
                dataIndex: 'distributionState',
                key: 'distributionState',
                render: (_, record) => (
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
                dataIndex: 'operation',
                render: (_, record) => (
                    <Space size="middle">
                        <NavLink
                            to={{
                                pathname: `/commodityManagement/list?id=${record.spuId}`,
                            }}
                        >
                            已铺货店铺管理
                        </NavLink>
                    </Space>
                ),
            },
        ];
    };
    render () {
        const { itemTableList, total, shopManagementLoading } = this.props;
        const { rowSelection, isAllValue } = this.state;
        return (
            <div className="shop-management">
                <Table
                    columns={this.getColumns()}
                    dataSource={itemTableList}
                    pagination={false}
                    rowSelection={rowSelection}
                    scroll={{
                        y: 500,
                    }}
                    ellipsis={true}
                    rowKey="spuId"
                    loading={shopManagementLoading}
                />
                <FooterPage
                    handelSelectAll={this.handelSelectAll}
                    changePageSize={this.changePageSize}
                    handelOperationBtn={this.handelOperationBtn}
                    isAllValue={isAllValue}
                    from="productList"
                    total={total}
                    selectNum={rowSelection.selectedRowKeys.length}
                ></FooterPage>
            </div>
        );
    }
}

export default CommodityContent;
