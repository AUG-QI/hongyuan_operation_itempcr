import { Space, Table } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { TableRowSelection } from 'antd/es/table/interface';
import FooterPage from '../../components/footerPage';

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
}

interface IState {
    /** 是否全选 */
    isAllValue: boolean;
    /** rowSelection */
    rowSelection: TableRowSelection<ItemsTableList>;
}

/** 表格头部属性 */
interface TitleType {
    key: string;
    name: string;
    age: number;
    address: string;
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
    componentDidMount (): void {
        console.log(this.props.itemTableList, '?????props');
        
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
    }

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
            rowSelection.selectedRowKeys = itemTableList.map((item) => item.key);
        }
        this.setState({ isAllValue: val });
    }

    /**
     * 改变页码
     * @returns
     */
    changePageSize = (val: number) => {
        const { changePageSize } = this.props;
        changePageSize(val);
    }

    /** 点击操作按钮 */
    handelOperationBtn = (type: string, category: string = '') => {
        // 导出商品
        if (type === 'exportItems') {
            this.handelExportItems(category);
        } else if (type === 'importItems') {
            this.handelImportItems();
        }
    }
    /**
     * 处理导出商品
     */
    handelExportItems = (category) => {
        console.log('handelExportItems', category);
    }
    /**
     * 处理导入商品
     * @returns 
     */
    handelImportItems = () => {
        console.log('handelImportItems');
    }
    /**
     * 获取表头
     * @returns 
     */
    getColumns = () => {
        return  [
            {
                title: '商品信息',
                dataIndex: 'name',
                width: 400,
                key: 'name',
                render: (_, record) => (
                    <Space
                        size="middle"
                        className='productInfo'
                    >
                        <div>
                            <div className='productInfo-img'>
                                <img src={record.url} alt="" />
                            </div>
                            <div className='productInfo-name'>{record.name}</div>
                            <div className='productInfo-id'>ID:{record.key}</div>
                            {/* <div>uweiruw</div> */}
                        </div>
                    </Space>
                ),
            },
            {
                title: '类目',
                dataIndex: 'leimu',
                key: 'leimu',
            },
            {
                title: '渠道',
                dataIndex: 'liangdao',
                key: 'liangdao',
                render: (_, record) => (
                    <Space
                        size="middle"
                    >
                        <div>234234</div>
                        {/* <div>
                            <img src="" alt="" />
                            <img src="" alt="" />
                            <img src="" alt="" />
                        </div>
                        <div>
                            <img src="" alt="" />
                            <img src="" alt="" />
                        </div> */}
                    </Space>
                ),
            },
            {
                title: '操作',
                dataIndex: 'address',
                render: (_, record) => (
                    <Space
                        size="middle"
                    >
                        <a><NavLink to={{ pathname: `/commodityManagement/list?id=${record.key}` }}>已铺货店铺管理</NavLink></a>
                    </Space>
                ),
            },
        ];
    }
    render () {
        const { itemTableList, total } = this.props;
        const { rowSelection, isAllValue } = this.state;
        return (
            <div>
                <Table
                    columns={this.getColumns()}
                    dataSource={itemTableList}
                    pagination={false}
                    rowSelection={rowSelection}
                    scroll={{
                        y: 500,
                      }}
                    ellipsis = {true}
                />
                <FooterPage
                    handelSelectAll={this.handelSelectAll}
                    changePageSize={this.changePageSize}
                    handelOperationBtn={this.handelOperationBtn}
                    isAllValue={isAllValue}
                    from="productList"
                    total={total}
                ></FooterPage>
            </div>
        );
    }
}

export default CommodityContent;
