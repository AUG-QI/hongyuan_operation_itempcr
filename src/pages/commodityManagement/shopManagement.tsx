import { message, Space, Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import FooterPage from '../../components/footerPage';
import SearchInput from '../../components/searchInput';
import SelectPlatform, { IMG_NAME, PLATFORM_IMG } from '../../components/selectPlatform';
import { isEmpty, transformationObject, UrlData } from '../../services/utils';
import { deleteRelation, reqSearchCommodity, reqSearchDistributorList } from './api';
import { ItemsTableList } from './commodityContent';

interface IProps {
}

/** 搜索值 */
interface SearchInfo {
    /** 输入框value */
    keyWord: string | number;
    /** 平台 */
    shopType: string;
    /** 页码 */
    pageNo: number;
    /** 每页展示 */
    pageSize: number;
    /** 货源商品id */
    originNumId: number | string;

}
/** 标题内容 */
interface TitleData {
    /** 商品图片url */
    itemImgUrl?: string;
    /** 商品标题 */
    itemTitle?: string;
    /** 铺货数量 */
    distributionNum?: number;
}

interface DeleteList {
    shop_id: number;
    num_iid: number;
    origin_num_iid: number;
}
interface IState {
    /** 是否全选 */
    isAllValue: boolean;
    /** rowSelection */
    rowSelection: TableRowSelection<ItemsTableList> | any;
    /** 铺货店铺数量 */
    storesItemNum: number;
    /** 搜索内容 */
    secarchInfo: SearchInfo;
    /** 分销商列表 */
    itemTableList: ItemsTableList[];
    /** 标题数据 */
    titleData: TitleData;
    /** 删除列表 */
    deleteList: DeleteList[];
}

/** 分销商列表页面 */
class ShopManagement extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            isAllValue: false,
            rowSelection: {
                onChange: this.changeTableSelectedState,
                selectedRowKeys: [],
                hideSelectAll: true,
            },
            storesItemNum: 0,
            itemTableList: [],
            titleData: {
                itemImgUrl: '',
                itemTitle: '',
                distributionNum: 0,
            },
            secarchInfo: {
                shopType: 'all',
                originNumId: '',
                keyWord: '',
                pageNo: 1,
                pageSize: 20,
            },
            deleteList: [],
        };
    }
    async componentDidMount () {
        // 拿到url里面的id
        const urlData: UrlData = transformationObject(location.href);
        if (isEmpty(urlData.id)) {
            return;
        }
        // 获取商品的具体数据
        const itemList = await reqSearchCommodity({ spuId: urlData.id });
        const itemData = itemList.list[0] || {};
        const titleData = {
            itemImgUrl: itemData.portalSquareImgUrl || '',
            itemTitle: itemData.productName || '',
        };
        const { secarchInfo } = this.state;
        secarchInfo.originNumId = urlData.id;
        this.setState({ titleData, secarchInfo }, () => {
            this.hadleAllSearch();
        });
    }
    /**
     * 获取table表头
     */
    getTableTitle = () => {
        return [
            {
                title: '平台名称',
                dataIndex: 'name',
                render: (name: any, record: any) => (
                    <Space size="middle">
                        <div className='name-icon'>
                            <img src={PLATFORM_IMG[IMG_NAME[record.shop_type]]} alt="" />
                        </div>
                    </Space>
                ),
            },
            {
                title: '分销商ID',
                dataIndex: 'user_id',
                align: 'center',
            },
            {
                title: '分销商名称',
                dataIndex: 'user_name',
                align: 'center',
            },
            {
                title: '店名',
                dataIndex: 'shop_name',
            },
            {
                title: '操作',
                dataIndex: 'address',
                align: 'center',
                render: (name: any, record: any) => (
                    <Space size="middle">
                        <a onClick={this.shelvesSuppliers.bind(this, record)}>下架</a>
                    </Space>
                ),
            },
        ];
    }
    /**
     * 下架商品
     */
    shelvesSuppliers = async ({ shop_id, num_iid, origin_num_iid }: any) => {
        const data = {
            shop_id,
            num_iid,
            origin_num_iid,
        };
        const res: any = await deleteRelation(data);
        if (!res.is_success) {
            message.error(res.error_msg);
            return;
        }
        message.success('下架成功');
        this.hadleAllSearch();
    }
    /**
     * 改变表格状态
     * @param val
     * @param item
     */
    changeTableSelectedState = (val: any, list: any) => {
        const { rowSelection, itemTableList } = this.state;
        rowSelection.selectedRowKeys = val;
        const deleteList: DeleteList[] = list.map((item: any) => {
            return {
                shop_id: item.shop_id,
                num_iid: item.num_iid,
                origin_num_iid: item.origin_num_iid,
            };
        });
        const isAllValue = val.length === itemTableList.length;
        this.setState({ isAllValue, deleteList, rowSelection });
    };
    /**
     * 全选
     * @return
     */
    handelSelectAll = (val: boolean) => {
        const { rowSelection, itemTableList } = this.state;
        if (!val) {
            rowSelection.selectedRowKeys = [];
        } else {
            rowSelection.selectedRowKeys = itemTableList.map((item: any) => item.origin_num_iid);
        }
        this.setState({ isAllValue: val, rowSelection });
    };

    /**
     * 改变页码
     * @returns
     */
    changePageSize = (val: number) => {
        const { secarchInfo } = this.state;
        secarchInfo.pageNo = val;
        this.setState({ secarchInfo }, () => {
            this.hadleAllSearch();
        });
    };
    /**
     * 修改input框状态
     */
    handleChangeInputVal = (val: string) => {
        const { secarchInfo } = this.state;
        secarchInfo.keyWord = val;
        this.setState({ secarchInfo });
    }
    /**
     * 处理批量下架
     * @param val
     */
    handelOperationBtn = async (val: string) => {
        const { deleteList } = this.state;
        if (!deleteList.length) {
            message.warning('请先选择平台');
            return;
        }
        if (val === 'takenDown') {
            let successNum = 0;
            let errorNum = 0;
            // 请求大集合
            const allRequests: any = [];
            deleteList.forEach((item) => {
                allRequests.push(new Promise(resolve => {
                    deleteRelation(item).then(res => {
                        if (res.code !== 200) {
                            errorNum += 1;
                        } else {
                            successNum += 1;
                        }
                        resolve(res);
                    });
                }));
            });
            const updateRes = await Promise.all(allRequests);
            const isSuccess = updateRes.every(item => item.is_success);
            if (isSuccess) {
                message.success('下架成功');
            } else {
                message.error('下架失败');
            }
            this.hadleAllSearch();
        }
    };
    /**
     * 处理搜索栏数据
     * @returns
     */
    handleSelectChange = (val: string) => {
        const { secarchInfo } = this.state;
        secarchInfo.shopType = val;
        this.setState({ secarchInfo }, () => {
            this.hadleAllSearch();
        });
    };
    /**
     * 处理input搜索
     */
    handleInputSearch = (val: string | number) => {
        const { secarchInfo } = this.state;
        secarchInfo.keyWord = val;
        this.setState({ secarchInfo }, () => {
            this.hadleAllSearch();
        });
    };
    /**
     * 返回上一页
     */
    rollback = () => {
        document.parentWindow.location.reload();
    };
    /**
     * 处理搜索
     */
    hadleAllSearch = async () => {
        const { secarchInfo, titleData, rowSelection } = this.state;
        const secarchData: any = {
            origin_num_iid: secarchInfo.originNumId,
            page_no: secarchInfo.pageNo,
            page_size: secarchInfo.pageSize,
        };
        if (secarchInfo.shopType[0] !== 'all') {
            secarchData.key_word = secarchInfo.keyWord;
        }
        const { items = [], total_amount = 0 } = await reqSearchDistributorList(secarchData);
        titleData.distributionNum = total_amount;
        this.setState({ itemTableList: items, isAllValue: false, rowSelection: { ...rowSelection, selectedRowKeys: [] } });
    }
    render (): React.ReactNode {
        const { rowSelection, isAllValue, itemTableList, titleData, secarchInfo } = this.state;
        return (
            <div className="shop-management">
                <div className="shop-management-title commodity-location">
                    <div className="item-img">
                        <img src={titleData.itemImgUrl} alt="" onError={(event: ChangeEvent<any>) => {
                            event.target.onerror = null; event.target.src = 'https://q.aiyongtech.com/biyao/imgs/error_img.jpeg';
                        }} />
                    </div>
                    <div className='item-title'>{titleData.itemTitle}</div>
                    <div className="item-sum">该商品已铺货店铺数：<span>{titleData.distributionNum}</span></div>
                </div>
                <div>
                    <div className="shop-management-content">
                        <div className="suppliers-title">
                            <Link to={'/commodityManagement'} className="suppliers-btn">
                                {'< 商品管理'}
                            </Link>
                            <div className="suppliers-input">
                                <SelectPlatform
                                    handleSelectChange={this.handleSelectChange}
                                    from='distributors'
                                    distributionState={secarchInfo.shopType}
                                ></SelectPlatform>
                                <SearchInput
                                    handleInputSearch={this.handleInputSearch}
                                    from="distributors"
                                    inputVal={secarchInfo.keyWord}
                                    handleChangeInputVal={this.handleChangeInputVal}
                                ></SearchInput>
                            </div>
                        </div>
                        <div className="shop-management-table">
                            <Table
                                columns={this.getTableTitle()}
                                dataSource={itemTableList}
                                rowSelection={rowSelection}
                                pagination={false}
                                scroll={{
                                    y: 500,
                                }}
                                align='center'
                                rowKey='origin_num_iid'
                            />
                        </div>
                    </div>
                    <FooterPage
                        isAllValue={isAllValue}
                        handelSelectAll={this.handelSelectAll}
                        changePageSize={this.changePageSize}
                        handelOperationBtn={this.handelOperationBtn}
                        from="distributors"
                        total={titleData.distributionNum}
                        selectNum={rowSelection.selectedRowKeys.length}
                        pageNo={secarchInfo.pageNo}
                    ></FooterPage>
                </div>
            </div>
        );
    }
}

export default ShopManagement;
