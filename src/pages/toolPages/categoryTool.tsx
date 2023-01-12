
// @ts-nocheck
import React from "react";
import { Button, Checkbox, Input, Select, ConfigProvider, Pagination, Empty, message, Tooltip, Modal, Spin } from "antd";

import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { getDefaultCids, DefaultSearchData } from ".";
import { DEFAULT_CATEGORY } from "../mapList";
import CategorySearch from "./components/categorySearch";
import { addAyCats, changeCats, getMultiPlatform, searchAyCats, searchCatsMapping, searchPlatformCats } from "../../../api/mapToolApi";

import zh_CN from 'antd/es/locale/zh_CN';
import { PLATFORM_IMG } from "../../components/selectPlatform";
import { isEmpty } from "../../services/utils";
const { Search } = Input;
interface CategoryToolProps {}
interface CategoryToolSearchData extends DefaultSearchData  {
    /** 选中的平台 */
    platform: 'DOUDIAN' | 'YOUZAN' | 'KWAISHOP' | 'WXVIDEOSHOP';
    /** 选中的子类目 */
    cids: string | number[];
}
const platform = ['DOUDIAN', 'YOUZAN', 'KWAISHOP', 'WXVIDEOSHOP'];
interface TableData {
    ay_parent_cids: string;
    ay_parent_cnames: string;
    by_cid: string;
    by_cids: string;
    by_cname: string;
    by_cnames: string;
    platform: string;
    platformCid: string;
    platformCids: string;
    platformCname: string;
    platformCnames: string;
}
interface EditDialogResList  {
    cids: string;
    cnames: string;
    relation: relationData[];
}
interface relationData {
    parent_cids: string;
    parent_cnames: string;
    platform: string;
}
interface CategoryToolState {
    /** 编辑状态 */
    editorStatus: boolean;
    /** 搜索参数 */
    searchData: CategoryToolSearchData;
    /** 选中的类目 */
    selectCategory: number[];
    tableData: TableData[] | [];
    /** 编辑弹框显示状态 */
    editDialogType: string | null;
    /** 编辑弹框的input值 */
    editDialogInputValue: string;
    /** 编辑弹框返回结果 */
    editDialogResList: any[];
    /** 选中的table index */
    selectTableIndex: number | null;
}
const PlatformOptions = [
    {
        value: 'DOUDIAN',
        label: '抖音',
    },
    {
        value: 'YOUZAN',
        label: '有赞',
    },
    {
        value: 'KWAISHOP',
        label: '快手',
    },
    {
        value: 'WXVIDEOSHOP',
        label: '视频号',
    },
];
let cids: string[] = [];
const TableDataDefaultTitleData = ['必要', '爱用'];
class CategoryTool extends React.Component<CategoryToolProps, CategoryToolState> {
    constructor (props: CategoryToolProps) {
        super(props);
        this.state = {
            editorStatus: false,
            selectCategory: [DEFAULT_CATEGORY],
            editDialogType: null,
            searchData: {
                pageNo: 1,
                pageSize: 20,
                platform: 'DOUDIAN',
                cids: '',
            },
            tableData: [],
            editDialogData: {},
            editDialogResList: [],
            editAllData: {},
            selectTableIndex: null,
            loading: false,
        };
    }
    componentDidMount (): void {
        cids = [];
        this.init();
    }
    /** 初始化数据 */
    init = async () => {
        const { searchData } = this.state;
        // 初始化cids数据
        this.handleSearch();
    }
    clickSyncDataBtn = async () => {
        const { editorStatus, editAllData } = this.state;
        if (editorStatus) {
            if (!isEmpty(editAllData)) {
                const newEditAllData = Object.keys(editAllData).map(item => {
                    return editAllData[item];
                });
                const res = await changeCats(newEditAllData);
                if (res === 'error') {
                    message.error('操作失败');
                } else {
                    message.success(res);
                }
            }
            sessionStorage.setItem('editorStatus', '0');
        } else {
            sessionStorage.setItem('editorStatus', '1');
        }
        this.setState({ editorStatus: !editorStatus, editAllData: {} }, () => {
            if (!editorStatus && !isEmpty(editAllData)) {
                this.handleSearch();
            }
        });
    }
    renderTitleStep = () => {
        const { editorStatus } = this.state;
        const statusText = editorStatus ? '保存设置' : '开始编辑';
        return <div className="log-search sync-attribute-title">
            <div className="steps-box">
                <span className="steps">1</span>
                <span className="steps-text">步骤一</span>
                <Button type="primary" onClick={this.clickSyncDataBtn}>
                    {statusText}
                </Button>
            </div>
        </div>;
    }
    /** 改变平台搜索 */
    handleChangePlatform = (value: CategoryToolSearchData['platform']) => {
        const { searchData } = this.state;
        this.setState({ searchData: { ...searchData, platform: value } }, () => {
            this.handleSearch();
        });
    }
    /** 改变类目搜索 */
    handleChangeCategory = (selectCategory: number[], cidsList: string) => {
        cids = JSON.parse(JSON.stringify(cidsList));
        this.setState({ selectCategory });
    }
    /** 关闭类目选择框后的回调 */
    handleDropdownCategoryCallback = (val: boolean) => {
        if (!val) {
            let { selectCategory, searchData } = this.state;
            if (isEmpty(selectCategory)) {
                selectCategory = [DEFAULT_CATEGORY];
            }
            // searchData[type] = selectedData;
            searchData.pageSize = 20;
            searchData.pageNo = 1;
            this.setState({ searchData, selectCategory }, () => {
                this.handleSearch();
            });
        }
    }
    /** 开始处理搜索 */
    handleSearch = async () => {
        const { searchData, selectCategory } = this.state;
        this.setState({ loading: true, tableData: [] });
        // 处理一下数据
        let allcidList = cids;
        // debugger
        if (isEmpty(selectCategory) || isEmpty(allcidList)) {
            allcidList = await getDefaultCids(DEFAULT_CATEGORY) || [];
        }
        cids = JSON.parse(JSON.stringify(allcidList));
        // 把cids根据分页进行拆分
        searchData.cids = allcidList.splice((searchData.pageNo - 1) * searchData.pageSize, searchData.pageSize).join(',');
        const res: TableData[] = await searchCatsMapping(searchData);
        if (res.length) {
            this.setState({ tableData: res, loading: false, editDialogType: null, selectTableIndex: null });
            return;
        }
        this.setState({ loading: false });
    }
    clickInput = (data: TableData, type: string, index: number) => {
        const ayNameList = data.by_cnames.split('>>');
        // 取最后一个
        const editDialogInputValue = ayNameList[ayNameList.length - 1];
        const selectCids = data.ay_parent_cids;
        // let editDialogInputValue = data.platformCname;
        // let selectCids = '';
        // if (type === 'aiyong') {
        //     // 爱用需要截取参数
        //     const ayNameList = data.by_cnames.split('>>');
        //     // 取最后一个
        //     editDialogInputValue = ayNameList[ayNameList.length - 1];
        //     selectCids = data.ay_parent_cids;
        // } else {
        //     selectCids = data.platformCids;
        // }
        this.setState({ editDialogData: { inputValue: editDialogInputValue, selectCids },  editDialogType: type, selectTableIndex: index }, () => {
            this.searchChildCategory();
        });
    }
    /** 搜索三级类目 */
    searchChildCategory = async () => {
        const { editDialogData, editDialogType } = this.state;
        let res = null;
        let editDialogResList = [];
        if (editDialogType === 'aiyong') {
            res = await searchAyCats({ keyword: editDialogData.inputValue });
            editDialogResList = res.map(item => {
                if (item.cids === editDialogData.selectCids) {
                    return {
                        ...item,
                        checked: true,
                    };
                }
                return item;
            });
        } else {
            // 三方平台
            res = await searchPlatformCats({ platform: editDialogType,  keyword: editDialogData.inputValue });
            editDialogResList = res.map(item => {
                if (item.parent_cids === editDialogData.selectCids) {
                    return {
                        ...item,
                        checked: true,
                    };
                }
                return item;
            });
        }
        if (isEmpty(res)) {
            res = [];
        }
        // 标记默认选中的值
        this.setState({ editDialogResList });
    }
    renderSearchBar = () => {
        const { searchData, selectCategory, editorStatus } = this.state;
        const statusText = editorStatus ? '保存设置' : '开始编辑';
        return <div className="log-search">
            <CategorySearch selectCategory={selectCategory} handleChangeCategory={this.handleChangeCategory} handleDropdownCategoryCallback={this.handleDropdownCategoryCallback}></CategorySearch>
            <Select
                value={searchData.platform}
                style={{ width: 120 }}
                onChange={this.handleChangePlatform}
                options={PlatformOptions}/>
            <Button type="primary" className="edit-btn" onClick={this.clickSyncDataBtn}>
                {statusText}
            </Button>
        </div>;
    }
    /** 关闭弹框 */
    closeEditDialog = () => {
        this.setState({ editDialogType: null, selectTableIndex: null });
    }
    /** 搜索三级类目数据 */
    searchInputValue = () => {
        this.searchChildCategory();
    }
    /** 改变编辑弹框里搜索三级类目input框的值 */
    changEditDialogInputValue = (event: any) => {
        const { editDialogData } = this.state;
        this.setState({ editDialogData: { ...editDialogData, inputValue: event.target.value } });
    }
    /** 处理新增爱用类目 */
    handleAddEditCategory = () => {
        const { selectTableIndex, tableData  } = this.state;
        const item = tableData[selectTableIndex] || {};
        // 询问弹框
        Modal.confirm({
            title: '温馨提示',
            content: (
                <div>
                    <p>是否继续新增爱用类目：</p>
                    <p>{item.by_cnames}</p>
                </div>
            ),
            onOk: () => {
                this.addAyCats(item);
            },
        });
    }
    addAyCats = async (item) => {
        const res = await addAyCats({ cnames: item.by_cnames, cids: item.by_cids });
        if (res !== 'success') {
            return message.error(`${res || '新增失败'}`);
        }
        this.searchChildCategory();
        // this.handleSearch();
        message.success('添加成功');
    }
    /** 编辑弹框模块 */
    renderEditDialog = () => {
        const { editDialogData, editDialogType, editDialogResList } = this.state;
        return <div className="edit-dialog">
            <Search className="edit-dialog-search-input" value={editDialogData.inputValue} placeholder="请输入搜索三级类目" enterButton onChange={this.changEditDialogInputValue} onSearch={this.searchInputValue} style={{ width: 200 }} />
            {/** 弹框内容 */}
            {this.renderEditDialogContent()}
            {/** 新增按钮 */}
            {!isEmpty(editDialogResList) && editDialogType === 'aiyong' && <div
                className={'add-outlined'}
                onClick={this.handleAddEditCategory}>
                新增爱用类目
                <Tooltip
                    placement="top"
                    title={
                        <div>
                            点击后将按必要类目名字新增爱用类目，以解决现有爱用类目不合适问题。
                            <div>注：爱用类目新增后，需完成下游平台类目绑定</div>
                        </div>
                    }
                >
                    <QuestionCircleOutlined className="question-icon" />
                </Tooltip>
            </div>}
            {/** 关闭按钮 */}
            <span
                className={'close-outlined'}
                onClick={this.closeEditDialog}>
                <CloseOutlined />
            </span>
        </div>;
    }
    /** 改变子类目 */
    changeSonCategory = (data) => {
        const { tableData, selectTableIndex, editDialogType, editAllData, searchData, editDialogResList, editDialogData } = this.state;

        if (isEmpty(selectTableIndex)) {
            return;
        }
        if (!isEmpty(editAllData)) {
            // 限制最大数量
            if (Object.keys(editAllData).length > 99) {
                return message.warning('超过改变最大数量，请先保存');
            }
        }
        const item = tableData[selectTableIndex];
        let newEditAllData = {};
        let selectCids = '';
        // 爱用处理
        if (editDialogType === 'aiyong') {
            item.ay_parent_cids = data.cids;
            item.ay_parent_cnames = data.cnames;
            newEditAllData = {
                ...editAllData,
                [`${item.by_cid}-${searchData.platform}`]: {
                    ...editAllData[`${item.by_cid}-${searchData.platform}`],
                    byCid: item.by_cid,
                    ayCnames: data.cnames,
                    ayCids: data.cids,
                    originAyCids: item.ay_parent_cids,
                    originAyCnames: item.ay_parent_cnames,
                },
            };
            selectCids = 'ay_parent_cids';
        } else {
            // 三方平台处理
            item.platformCids = data.parent_cids;
            item.platformCnames = data.parent_cnames;
            newEditAllData = {
                ...editAllData,
                [`${item.by_cid}-${searchData.platform}`]: {
                    ...editAllData[`${item.by_cid}-${searchData.platform}`],
                    byCid: item.by_cid,
                    originAyCids: item.ay_parent_cids,
                    originAyCnames: item.ay_parent_cnames,
                    platform: searchData.platform,
                    platformCids: data.parent_cids,
                    platformCnames: data.parent_cnames,
                },
            };
            selectCids = 'platformCids';
        }
        // 过滤掉之前的选择新的数据
        const newEditDialogResList = editDialogResList.map(info => {
            if ((info.cids || info.parent_cids) === item[selectCids]) {
                return {
                    ...info,
                    checked: true,
                };
            }
            return {
                ...info,
                checked: false,
            };
        });
        // 设置一下传入后端的数据
        this.setState({ tableData, editAllData: newEditAllData, editDialogResList: newEditDialogResList });
    }
    renderEditDialogContent = () => {
        const { editDialogResList, editDialogType } = this.state;
        const name = PlatformOptions.find(item => editDialogType === item.value) || {};
        let categoryName = '爱用';
        if (name?.label) {
            categoryName = name?.label;
        }
        // 没有数据
        if (!editDialogResList.length) {
            return <div className="value-box-empty">
                <Empty description={`暂无相关${categoryName}类目`}>
                    {editDialogType === 'aiyong' && <span onClick={this.handleAddEditCategory} style={{ color: '#1890ff', cursor: 'pointer' }}>新增爱用类目</span>}
                </Empty>
            </div>;
        }
        // 爱用返回的跟多平台不一样
        if (editDialogType === 'aiyong') {
            return <div className="edit-dialog-content">
                <div className="edit-dialog-content-box">
                    {
                        editDialogResList.map((item, index) => {
                            //  做个排序
                            item.relation?.sort(((item, item2) => {
                                return platform.indexOf(item.platform) - platform.indexOf(item2.platform);
                            }));
                            return <div key={index} className={`edit-dialog-content-item ${item.checked ? 'item-select' : ''}`} onClick={this.changeSonCategory.bind(this, item)}>
                                <div className="category-cnames"> {item.cnames}</div>
                                <div className="category-relation">
                                    {item.relation?.length ? item.relation.map((info, index2) => {
                                        if (info.platform === 'BIYAO') {
                                            return null;
                                        }
                                        const imgUrl = PLATFORM_IMG[info.platform.toLowerCase()];
                                        return <div className="category-relation-item" key={index2}><span className="content-item-img"><img src={imgUrl} alt="" /></span ><span>{info.parent_cnames}</span></div>;
                                    }) : null}
                                </div>
                                {item.checked ? <div className={'select-icon'}><img src="https://q.aiyongtech.com/biyao/imgs/select_right_top.png" alt="" /></div> : null}
                            </div>;
                        })
                    }
                </div>
            </div>;
        }
        return <div className="edit-dialog-content">
            <div className="edit-dialog-content-box">
                {
                    editDialogResList.map((item, index) => {
                        return <div key={index}className={`edit-dialog-content-item ${item.checked ? 'item-select' : ''}`} onClick={this.changeSonCategory.bind(this, item)}>
                            <div className="category-relation">{item.parent_cnames}</div>
                            {item.checked && <div className={'select-icon'}><img src="https://q.aiyongtech.com/biyao/imgs/select_right_top.png" alt="" /></div>}
                        </div>;
                    })
                }
            </div>
        </div>;
    }
    clickItem = () => {
        message.warning('点击上方按钮后启动编辑模式');
    }
    /** table表格 */
    renderTable = () => {
        const { tableData, editorStatus, searchData, editDialogType } = this.state;
        // 处理一下当前表格的数据
        const newTitleData = PlatformOptions.filter(item => item.value === searchData.platform).map(item => item.label);
        /** 表格内容渲染 */
        const renderTableContent = () => {
            if (!tableData.length) {
                return <div className="value-box-empty">
                    <Empty description="暂无数据" />
                </div>;
            }
            return tableData.map((item, index) => {
                return <div className="log-table-content-item" key={item.by_cid}>
                    <div className="log-table-content-item-info biyao-cids">{item.by_cnames}</div>
                    { editorStatus ? <input className="log-table-content-item-info" readOnly value={item.ay_parent_cnames} onClick={this.clickInput.bind(this, item, 'aiyong', index)}/> : <div className="log-table-content-item-info" onClick={this.clickItem}>{item.ay_parent_cnames || '-'}</div> }
                    { editorStatus ? <input className="log-table-content-item-info" readOnly value={item.platformCnames} onClick={this.clickInput.bind(this, item, searchData.platform, index)}/> : <div className="log-table-content-item-info" onClick={this.clickItem}>{item.platformCnames || '-'}</div>}
                </div>;
            });
        };
        return <div className={`log-table ${editorStatus && editDialogType ? 'table-small' : ''}`}>
            <div className="log-table-title">
                {
                    TableDataDefaultTitleData.map((item: string, index: number) => {
                        return <div className={`log-table-title-item ${index === 0 ? 'biyao-cids' : '' }`} key={index}>{item}类目</div>;
                    })
                }
                {
                    newTitleData.map((item: string, index: number) => {
                        return <div className="log-table-title-item" key={index}>{item}类目</div>;
                    })
                }
            </div>
            <div className="log-table-content">
                {
                    renderTableContent()
                }
            </div>
        </div>;
    }
    /** 页码模块 */
    changePage = (pageNo: number, pageSize: number) => {
        const { searchData } = this.state;
        this.setState({ searchData: { ...searchData, pageNo, pageSize } }, () => {
            this.handleSearch();
        });
    }
    /** 分页模块 */
    renderPaging = () => {
        const { searchData } = this.state;
        return <div className="log-paging" >
            <ConfigProvider locale={zh_CN}>
                <Pagination showTotal={(total) => `共 ${total} 项 `} showSizeChanger={true} defaultPageSize={20} current={searchData.pageNo || 1} total={cids.length} onChange={this.changePage.bind(this)} pageSizeOptions={['20', '50', '80', '100']}/>
            </ConfigProvider>
        </div>;
    }
    render () {
        const { editorStatus, editDialogType, loading } = this.state;
        return (<div className="category-tool-render">
            {/** 步骤拦 */}
            {/* { this.renderTitleStep() } */}
            {/** 搜索栏 */}
            { this.renderSearchBar() }
            {/** 数据表格 */}
            <Spin spinning={loading}>
                { this.renderTable() }
            </Spin>
            {/** 分页框 */}
            {this.renderPaging()}
            {/** 编辑弹框 */}
            { editorStatus && editDialogType && this.renderEditDialog() }
        </div>);
    }
}

export default CategoryTool;
