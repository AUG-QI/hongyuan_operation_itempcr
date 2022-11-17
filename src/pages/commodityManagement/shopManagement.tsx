import { message, Modal, Select, Space, Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { ItemsTableList } from './index';
import FooterPage from '../../components/footerPage';
import SearchInput from '../../components/searchInput';
import { IMG_NAME, PLATFORM_IMG, PLATFORM_OPTIONS } from '../../components/selectPlatform';
import { isEmpty, transformationObject, UrlData } from '../../services/utils';
import { deleteRelation, reqSearchCommodity, reqSearchDistributorList, saveItemRemovedLog } from './api';
import { searchItemRemovedLog } from '../operationLog/api';
import './index.scss';

const { Option } = Select;
interface IProps {
}

export const PLATFORM: any = {
    doudian: 'dy',
    youzan: 'yz',
    kuai: 'ks',
    shipinhao: 'videoShop',
};

/** 搜索值 */
interface SearchInfo {
    /** 输入框value */
    keyWord: string;
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
    itemId: any;
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
    operationTimeDialogVisible: boolean;
    operationTimeList: any;
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
                itemId: '',
            },
            secarchInfo: {
                shopType: 'all',
                originNumId: '',
                keyWord: '',
                pageNo: 1,
                pageSize: 20,
            },
            deleteList: [],
            operationTimeDialogVisible: false,
            operationTimeList: [],
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
            itemId: urlData.id,
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
                fixed: 'right',
                render: (name: any, record: any) => (
                    <Space size="middle">
                        <a onClick={this.shelvesSuppliers.bind(this, record)}>下架</a>
                    </Space>
                ),
            },
            {
                title: '操作时间',
                dataIndex: 'time',
                align: 'center',
                fixed: 'right',
                render: (name: any, record: any) => (
                    <Space size="middle">
                        <a onClick={this.checkOperationTimeDialog.bind(this, record)}>查看操作时间</a>
                    </Space>
                ),
            },
        ];
    }
    /**
     * 查看操作时间弹框
     * @param record
     * @returns
     */
    checkOperationTimeDialog = async (record: any) => {
        if (record === false) {
            this.setState({ operationTimeDialogVisible: false });
            return;
        }
        this.setState({ operationTimeDialogVisible: true });
        const data = {
            platformName: record.shop_type,
            biyaoItemId: record.origin_num_iid,
            distributorId: record.user_id,
            distributorShopName: record.shop_name,
        };
        const res: any = await searchItemRemovedLog(data);
        if (!res || res.count === 0) {
            return;
        }
        this.setState({ operationTimeList: res.data });
    }
    /**
     * 下架商品
     */
    shelvesSuppliers = async (record: any) => {
        const { shop_id, num_iid, origin_num_iid, shop_type, user_id, shop_name  } = record;
        // @ts-ignore
        const userInfo: any = JSON.parse(sessionStorage.getItem('userInfo')) || {};
        const { titleData } = this.state;
        const data = {
            shop_id,
            num_iid,
            origin_num_iid,
        };
        const res: any = await deleteRelation(data);
        const logData: any = {
            platformName: shop_type,
            biyaoItemId: titleData.itemId,
            biyaoItemName: titleData.itemTitle,
            distributorId: user_id,
            distributorShopName: shop_name,
            operationAccount: userInfo.account,
        };

        if (!res.is_success) {
            message.error(res.error_msg);
            logData.operationResult = 0;
            logData.operationResultDetail = res.error_msg;
        } else {
            message.success('下架成功');
            this.hadleAllSearch();
            logData.operationResult = 1;
            logData.operationResultDetail = '下架成功';
        }
        // 保存操作日志
        this.saveDeleteRelationLog([logData]);
    }
    /**
     * 保存操作日志
     */
    saveDeleteRelationLog = async (logData: any) => {
        await saveItemRemovedLog(logData);
    }
    /**
     * 改变表格状态
     * @param val
     * @param item
     */
    changeTableSelectedState = (val: any, list: any) => {
        const { rowSelection, itemTableList } = this.state;
        rowSelection.selectedRowKeys = val;
        const deleteList: DeleteList[] = list;
        const isAllValue = val.length === itemTableList.length;
        this.setState({ isAllValue, deleteList, rowSelection });
    };
    /**
     * 全选
     * @return
     */
    handelSelectAll = (val: boolean) => {
        const { rowSelection, itemTableList } = this.state;
        let deleteList: any = [];
        if (!val) {
            rowSelection.selectedRowKeys = [];
        } else {
            rowSelection.selectedRowKeys = itemTableList.map((item: any) => item.relation_id);
            deleteList = itemTableList;
        }
        this.setState({ isAllValue: val, rowSelection, deleteList });
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
        const { deleteList, titleData } = this.state;
        const userInfoJson: any = sessionStorage.getItem('userInfo');
        const userInfo: any = JSON.parse(userInfoJson) || {};
        if (!deleteList.length) {
            message.warning('请先选择平台');
            return;
        }
        const deleteKeyList = deleteList.map((item: any) => {
            return {
                shop_id: item.shop_id,
                num_iid: item.num_iid,
                origin_num_iid: item.origin_num_iid,
            };
        });
        if (val === 'takenDown') {
            // 请求大集合
            const allRequests: any = deleteKeyList.map((item) => {
                return deleteRelation(item);
            });
            const updateRes = await Promise.all(allRequests);
            const saveLogData: any = [];
            updateRes.forEach((item, index) => {
                const key: any = deleteList[index];
                const data: any = {
                    platformName: key.shop_type,
                    biyaoItemId: titleData.itemId,
                    biyaoItemName: titleData.itemTitle,
                    distributorId: key.user_id,
                    distributorShopName: key.shop_name,
                    operationAccount: userInfo.account,
                };
                if (!item.is_success) {
                    data.operationResult = 0;
                    data.operationResultDetail = item.error_msg;
                } else {
                    data.operationResult = 1;
                    data.operationResultDetail = '下架成功';
                }
                saveLogData.push(data);
            });
            const isSuccess = updateRes.every(item => item.is_success);
            if (isSuccess) {
                message.success('下架成功');
            } else {
                message.error('下架失败');
            }
            this.saveDeleteRelationLog(saveLogData);
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
    handleInputSearch = (val: string) => {
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
        // @ts-ignore
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
        if (secarchInfo.shopType !== 'all') {
            secarchData.shop_type = PLATFORM[secarchInfo.shopType];
        }
        if (secarchInfo.keyWord && secarchInfo.keyWord.trim()) {
            secarchData.key_word = secarchInfo.keyWord;
        }
        const { items = [], total_amount = 0 } = await reqSearchDistributorList(secarchData);
        titleData.distributionNum = total_amount;
        this.setState({ itemTableList: items, isAllValue: false, rowSelection: { ...rowSelection, selectedRowKeys: [], deleteList: [] } });
    }
    render (): React.ReactNode {
        const { rowSelection, isAllValue, itemTableList, titleData, secarchInfo, operationTimeDialogVisible, operationTimeList } = this.state;
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
                                <Select
                                    value={secarchInfo.shopType}
                                    onChange={this.handleSelectChange}
                                    style={{ width: 200 }}
                                    showArrow={true}
                                    notFoundContent='暂无搜索内容'
                                >
                                    {PLATFORM_OPTIONS.map((item) => {
                                        return (
                                            <Option
                                                key={item.value}
                                                value={item.value}
                                                label={item.label}
                                            >
                                                <div className='demo-option-label-item'>
                                                    <span role='img' aria-label="China" className='option-items-img'>
                                                        <img src={PLATFORM_IMG[item.value]} alt='' />
                                                    </span>
                                                    {item.label}
                                                </div>
                                            </Option>
                                        );
                                    })}
                                </Select>
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
                                // @ts-ignore
                                columns={this.getTableTitle()}
                                dataSource={itemTableList}
                                rowSelection={rowSelection}
                                pagination={false}
                                scroll={{ y: 1000 }}
                                align='center'
                                rowKey='relation_id'
                                ellipsis
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
                <Modal key='operationTimeDialog' title="查看操作时间" open={operationTimeDialogVisible} onCancel={this.checkOperationTimeDialog.bind(this, false)} footer={null} className='upload-info-dialog'>
                    <div className='ant-upload' >
                        <div className='operation-info'>
                            <span>操作人</span>
                            <span>操作结果</span>
                            <span>操作时间</span>
                        </div>
                        {
                            operationTimeList.length ? operationTimeList.map((item: any, index: number) => {
                                return <div key={index} className='operation-info'>
                                    <span>{item.operationAccount}</span> <span>{item.operationResultDetail}</span><span>{item.removedTime}</span>
                                </div>;
                            }) : <div>暂无操作时间</div>
                        }
                    </div>
                </Modal>
            </div>
        );
    }
}

export default ShopManagement;
