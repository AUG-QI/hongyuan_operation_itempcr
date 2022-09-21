import { Space, Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import React from 'react';
import { useParams } from 'react-router';
import FooterPage from '../../components/footerPage';
import SearchInput from '../../components/searchInput';
import SelectPlatform from '../../components/selectPlatform';
import { isEmpty, transformationObject, UrlData } from '../../services/utils';
import { reqSearchCommodity, reqSearchDistributorList } from './api';
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
    itemImgUrl: string;
    /** 商品标题 */
    itemTitle: string;
    /** 铺货数量 */
    distributionNum?: number;
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
        const itemData: TitleData = itemList[0];
        const titleData = {
            itemImgUrl: itemData.productName,
            itemTitle: itemData.portalSquareImgUrl,
        };
        const { secarchInfo } = this.state;
        secarchInfo.originNumId = urlData.id;
        const { items = [], total_amount = 0 } = reqSearchDistributorList(secarchInfo);
        titleData.distributionNum = total_amount;
        this.setState({ titleData, secarchInfo, itemTableList: items });
    }
    /**
     * 获取table表头
     */
    getTableTitle = () => {
        return [
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
                        <a onClick={this.shelvesSuppliers.bind(this, record)}>下架</a>
                    </Space>
                ),
            },
        ];
    }
    /**
     * 下架商品
     */
    shelvesSuppliers = (record) => {
        console.log(record, '????record');
        
    }
    // componentDidMount (): void {
    //     // const { id } = useParams();
    //     // console.log(useParams());
    //     const location = useLocation();
    //     console.log(location, '????');
        
        
        
    // }
    changeTableSelectedState = () => {
        console.log('changeTableSelectedState');
    };
    /**
     * 全选
     * @return
     */
    handelSelectAll = (val: boolean) => {
        // const { itemTableList } = this.props;
        const { rowSelection, itemTableList } = this.state;
        if (!val) {
            rowSelection.selectedRowKeys = [];
        } else {
            rowSelection.selectedRowKeys = itemTableList.map(
                (item) => item.key
            );
        }
        this.setState({ isAllValue: val });
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
    hadleAllSearch = async() => {
        const { secarchInfo } = this.state;
        const res = await reqSearchDistributorList(secarchInfo);
        console.log(res, 'res');
        
    }
    render(): React.ReactNode {
        const { itemData } = this.props;
        const { rowSelection, isAllValue, storesItemNum, itemTableList } = this.state;
        return (
            <div className="shop-management">
                <div className="shop-management-title commodity-location">
                    <div className="item-img">
                        {/* <img src={itemData.img} alt="" /> */}
                    </div>
                    {/* <div className='item-title'>{itemData.title}</div> */}
                    <div className='item-title'>234234234234</div>
                    <div className="item-sum">该商品已铺货店铺数：<span>{storesItemNum}</span></div>
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
                            />
                        </div>
                    </div>
                    <FooterPage
                        isAllValue={isAllValue}
                        handelSelectAll={this.handelSelectAll}
                        changePageSize={this.changePageSize}
                        handelOperationBtn={this.handelOperationBtn}
                        from="distributors"
                    ></FooterPage>
                </div>
            </div>
        );
    }
}

export default ShopManagement;
