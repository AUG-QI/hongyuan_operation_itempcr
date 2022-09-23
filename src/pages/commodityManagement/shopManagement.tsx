import { Space, Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import React from 'react';
import { useParams } from 'react-router';
import FooterPage from '../../components/footerPage';
import SearchInput from '../../components/searchInput';
import SelectPlatform, { PLATFORM_IMG } from '../../components/selectPlatform';
import { isEmpty, transformationObject, UrlData } from '../../services/utils';
import { deleteRelation, reqSearchCommodity, reqSearchDistributorList } from './api';
import { ItemsTableList } from './commodityContent';

/** 分销商表格头部 */
const DISTRIBUTORS_HEAD_TITLE = [
    {
        title: '平台名称',
        dataIndex: 'name',
    },
    {
        title: '分销商ID',
        dataIndex: 'age',
    },
    {
        title: '分销商名称',
        dataIndex: 'address',
    },
    {
        title: '店名',
        dataIndex: 'address',
    },
    {
        title: '操作',
        dataIndex: 'address',
        render: (_, record) => (
            <Space size="middle">
                <a>下架</a>
            </Space>
        ),
    },
];

const PLATFORM_MAP = {
    dy: 'doudian',
    ks: 'youzan',
    xhs: 'hong',
};

const rollback = () => {
    window.history.back(-1);
};

interface ItemData {
    img: string;
    title: string;
}
interface IProps {

    /** 商品信息 */
    // itemData: ItemData;
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
    rowSelection: TableRowSelection<ItemsTableList>;
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
            this.hadleAllSearch(secarchInfo);
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
                render: (_, record) => (
                    <Space size="middle">
                        <div className='name-icon'>
                            <img src={record.url} alt="" />
                        </div>
                    </Space>
                ),
            },
            {
                title: '分销商ID',
                dataIndex: 'user_id',
            },
            {
                title: '分销商名称',
                dataIndex: 'user_name',
            },
            {
                title: '店名',
                dataIndex: 'shop_name',
            },
            {
                title: '操作',
                dataIndex: 'address',
                render: (_, record) => (
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
    shelvesSuppliers = async ({ shop_id, num_iid, origin_num_iid }) => {
        const data = {
            shop_id,
            num_iid,
            origin_num_iid,
        };
        const res = await deleteRelation(data);
        console.log(res);
        
        
    }
    /**
     * 改变表格状态
     * @param val 
     * @param item 
     */
    changeTableSelectedState = (val, list) => {
        const { rowSelection, itemTableList } = this.state;
        rowSelection.selectedRowKeys = val;
        const deleteList: DeleteList[] = list.map(item => {
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
            rowSelection.selectedRowKeys = itemTableList.map((item) => item.origin_num_iid);
        }
        this.setState({ isAllValue: val, rowSelection });
    };

    /**
     * 改变页码
     * @returns
     */
    changePageSize = (val) => {
        console.log('changePageSize');
        const { secarchInfo } = this.state;
        secarchInfo.pageNo = val;
        this.setState({ secarchInfo }, () => {
            this.hadleAllSearch();
        });
    };

    /**
     * 处理批量下架
     * @param val 
     */
    handelOperationBtn = (val: string) => {
        if (val === 'takenDown') {
            // 拿到值
            const { deleteList } = this.state;
            deleteList.forEach(async (item) => {
               const res = await deleteRelation(item);
            })
        }
    };
    /**
     * 处理搜索栏数据
     * @returns
     */
    handleSelectChange = (val: string) => {
        console.log('vhandleSelectChange');
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
        console.log('handleInputSearch');
        const { secarchInfo } = this.state;
        secarchInfo.keyWord = val;
        this.setState({ secarchInfo }, () => {
            this.hadleAllSearch();
        });
    };
    /**
     * 处理搜索
     */
    hadleAllSearch = async () => {
        const { secarchInfo, titleData } = this.state;
        const { items = [], total_amount = 0 } = await reqSearchDistributorList(secarchInfo);
        const itemTableList = items.map(item => {
            const platform = PLATFORM_MAP[item.shop_type];
            return item.url = PLATFORM_IMG[platform];
        });
        titleData.distributionNum = total_amount;
        this.setState({ itemTableList: items });
    }
    render (): React.ReactNode {
        const { rowSelection, isAllValue, storesItemNum, itemTableList, titleData } = this.state;
        return (
            <div className="shop-management">
                <div className="shop-management-title commodity-location">
                    <div className="item-img">
                        <img src={titleData.itemImgUrl} alt="" onError={(e) => {e.target.onerror = null; e.target.src="https://q.aiyongtech.com/biyao/imgs/error_img.jpeg"}} />
                    </div>
                    <div className='item-title'>{titleData.itemTitle}</div>
                    <div className="item-sum">该商品已铺货店铺数：<span>{titleData.distributionNum}</span></div>
                </div>
                <div>
                    <div className="shop-management-content">
                        <div className="suppliers-title">
                            <div className="suppliers-btn" onClick={rollback}>
                                {'< 商品管理'}
                            </div>
                            <div className="suppliers-input">
                                <SelectPlatform
                                    handleSelectChange={this.handleSelectChange}
                                    from='distributors'
                                ></SelectPlatform>
                                <SearchInput
                                    handleInputSearch={this.handleInputSearch}
                                    from="distributors"
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
                                ellipsis = {true}
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
                    ></FooterPage>
                </div>
            </div>
        );
    }
}

export default ShopManagement;
