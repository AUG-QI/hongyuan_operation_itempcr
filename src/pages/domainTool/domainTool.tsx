import {
    Button,
    Cascader,
    Select,
    Input,
    Checkbox,
    Pagination,
    message,
    Modal,
    ConfigProvider,
    Spin,
    Tooltip,
    Empty,
} from 'antd';
import {
    CloseOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import React from 'react';
import { DomainToolTableTitle, findKey, platforms_Map } from '.';
import SyncAttributeTitle, {
    treeTransferRender,
} from '../../components/syncAttributeTitle';
import { getCategoryOptions } from '../commodityManagement/api';
import {
    biyaoMapDomainOptions,
    DEFAULT_CATEGORY,
    findSonByRecursion,
} from '../mapList';
import {
    getPvaluesMapList,
    setPvaluesBindRelation,
    syncPvaluesRelation,
} from '../../../api/mulitemtransfromApi';
import { IMG_NAME, PLATFORM_IMG } from '../../components/selectPlatform';
import { getID } from '../inventorySynchronous';
import zh_CN from 'antd/es/locale/zh_CN';
import './index.scss';
import { isEmpty } from '../../services/utils';

const { Search } = Input;

/** 值域工具 */
class DomainTool extends React.Component<any, any> {
    constructor(props: {}) {
        super(props);
        this.state = {
            categoryoptions: [],
            searchData: {
                pageNo: 1,
                pageSize: 20,
            },
            searchInputValue: '',
            selectBoxVisible: false,
            tableData: [],
            editorStatus: false,
            total: 0,
            selectedIndex: null,
            biyaoPlatformData: [],
            ayValueList: [],
            selectData: [],
            checkedKeys: [],
            treeData: [],
            treeDataVisible: false,
            spinning: true,
            setValueData: {},
            ayAttributeName: '',
            platValuesStatus: true,
        };
    }
    async componentDidMount() {
        // 获取类目数据
        const categoryoptions: any = await getCategoryOptions();
        if (!categoryoptions.length) {
            return;
        }
        // 默认选中美妆类
        this.setState({ categoryoptions }, () => {
            this.init();
        });
    }
    init = async () => {
        const searchData = {
            pageNo: 1,
            pageSize: 20,
            leimuValue: [DEFAULT_CATEGORY],
            cids: this.getDefaultCids(),
        };
        this.setState({ searchData, searchInputValue: '', ayAttributeName: '' }, () => {
            this.handleSearch();
        });
    };

    handleSearch = async () => {
        const { searchData } = this.state;
        const cids = searchData.cids.join(',');
        const res: any = await getPvaluesMapList({ ...searchData, cids });
        const tableData =
            res.pvalues?.map((item: any) => {
                return { ...item, checked: false };
            }) || [];
        this.setState({
            tableData,
            total: res.total,
            ayValueList: res.ay_value_list,
            spinning: false,
        });
    };
    /**
     * 改变选择器
     * @returns
     */
    handleChange = (type: string, val: any) => {
        const selectedData: any = val;
        const { searchData } = this.state;
        if (type === 'leimuValue') {
            const newCids =
                val?.map((item: any) => item[item?.length - 1]) || [];
            searchData.cids = newCids;
            searchData[type] = selectedData;
            this.setState({ searchData });
            return;
        }
        searchData[type] = selectedData;
        searchData.pageSize = 20;
        searchData.pageNo = 1;
        this.setState({ searchData }, () => {
            this.handleSearch();
        });
    };
    /** 获取初始化搜索cids */
    getDefaultCids = () => {
        const { categoryoptions } = this.state;
        const defaultData = categoryoptions.filter(
            (item: any) => item.categoryId === DEFAULT_CATEGORY
        );
        const cids: any = [];
        return findSonByRecursion(defaultData, cids);
    };
    initSearchData = () => {
        this.init();
    };
    changeCheckbox = (index: number, val: any) => {
        const { tableData } = this.state;
        tableData[index] = { ...tableData[index], checked: val.target.checked };
        this.setState({ tableData });
    };
    onFocusBiyaoAttributeInput = (index: number, item: any) => {
        this.setState({
            selectBoxVisible: true,
            selectedIndex: index,
            biyaoPlatformData: item,
        });
    };
    onBlurBiyaoAttributeInput = () => {};
    /**
     * 改变分页器
     */
    changePage = (pageNo: number, pageSize: number) => {
        const { searchData } = this.state;
        this.setState(
            { searchData: { ...searchData, pageNo, pageSize } },
            () => {
                this.handleSearch();
            }
        );
    };
    changeAllCheckbox = (val: any) => {
        const { tableData } = this.state;
        tableData.forEach((item: any) => {
            item.checked = val.target.checked;
        });
        this.setState({ tableData });
    };
    /**
     * 处理批量应用
     */
    hadleBatchBind = () => {
        const { tableData, categoryoptions } = this.state;
        const checkedList = tableData.filter((item: any) => item.checked);
        const cidName = checkedList.map(
            (item: any) => item.parent_cnames.split('>>')[0]
        );
        const isSame = cidName.every((item: any) => cidName[0] === item);
        if (!isSame) {
            return message.warning('请选择相同的必要属性');
        }
        const treeData = categoryoptions.filter(
            (item: any) => item.categoryName === cidName[0]
        );
        this.setState({ treeData, treeDataVisible: true });
    };
    /**
     * 编辑属性
     */
    handleEditorAttribute = async (val: any, type: any) => {
        // 保存
        if (type === '保存设置') {
            const { setValueData } = this.state;
            const arr = Object.keys(setValueData).map(
                (key) => setValueData[key]
            );

            if (!arr.length) {
                this.setState({ editorStatus: val, setValueData: {} });
                return;
            }
            const res = await setPvaluesBindRelation(arr);
            message.success(res);
        }
        this.setState({ editorStatus: val, setValueData: {} }, () => {
            this.handleSearch();
        });
    };
    changeItemPlatform = () => {};
    closeSelectDialog = () => {
        this.setState({ selectBoxVisible: false });
    };
    /**
     * 改变input值
     */
    changeInputValue = (type: string, event: any) => {
        let value = event.target.value;
        if (value) {
            value = value.trim();
        }
        this.setState({ [type]: value });
    };
    /** 处理同步数据 */
    handleSyncData = async () => {
        const { selectData, tableData } = this.state;
        if (!selectData.length) {
            return message.warning('请选择类目');
        }
        const selectCids = selectData.map((item: any) => item.cid);
        const checkedList = tableData.filter(
            (item: any) => item.checked && item.ay_vids
        );
        if (!checkedList.length) {
            return message.warning('请填写完整爱用值域名字');
        }
        const syncPvalues: any = checkedList.map((item: any) => {
            return {
                platform_prop_value_name: item.platform_prop_value_name,
                map_vnames: item.ay_vids?.map(
                    (item: any) => item.ay_prop_value_name
                ),
            };
        });
        const res = await syncPvaluesRelation({
            cids: selectCids.join(','),
            syncPvalues,
        });
        message.success(res);
        this.setState({ treeDataVisible: false });
    };
    /** 选中爱用值域 */
    clickAyValue = (item: any, key: string = '') => {
      
        
        const { selectedIndex, tableData, setValueData } = this.state;
        
        let data = tableData[selectedIndex].ay_vids || [];
        const tableDataItem = tableData[selectedIndex];
        console.log(tableDataItem, '???/item');
        const itemPlatforms =
            item.platforms?.filter((info: string) => info !== 'BIYAO') || [key] || [];
        if (!data.length) {
            data.push({
                ay_prop_value_id:
                    item.ay_prop_value_id || item.platform_prop_value_id,
                ay_prop_value_name:
                    item.ay_prop_value_name || item.platform_prop_value_name,
                platforms: itemPlatforms || [key],
            });
        } else {
            if (key) {
                data = data?.filter(
                    (info: any) =>
                        !(
                            info.platforms?.length &&
                            info.platforms?.includes(key)
                        )
                );
                data.push({
                    ay_prop_value_id:
                        item.ay_prop_value_id || item.platform_prop_value_id,
                    ay_prop_value_name:
                        item.ay_prop_value_name ||
                        item.platform_prop_value_name,
                    platforms: itemPlatforms || [key],
                });
            } else {
                const str = itemPlatforms.join(',');
                const dataPlatforms = data?.filter(
                    (info: any) => !info.platforms?.some((val:string) => str.includes(val))
                );
                data = [
                    ...dataPlatforms,
                    {
                        ay_prop_value_id:
                            item.ay_prop_value_id ||
                            item.platform_prop_value_id,
                        ay_prop_value_name:
                            item.ay_prop_value_name ||
                            item.platform_prop_value_name,
                        platforms: itemPlatforms || [key],
                    },
                ];
            }
        }
        const setValueDataKey = `${tableDataItem.ay_cid}+${tableDataItem.ay_prop_value_id}`;
        const setValueList = [];
        if (key) {
            data.forEach((info: any) => {
                setValueList.push({
                    set_platform_prop_value_id: info.ay_prop_value_id,
                    set_platform_prop_value_name: info.ay_prop_value_name,
                    platform: info.platforms?.join(','),
                });
            });
        } else {
            setValueList.push({
                set_ay_prop_value_id: item.ay_prop_value_id,
                set_ay_prop_value_name: item.ay_prop_value_name,
            });
        }
        const itemList = {
            ay_cid: tableDataItem.ay_cid,
            ay_prop_id: tableDataItem.ay_prop_id,
            ay_prop_value_id: tableDataItem.ay_prop_value_id,
            ay_prop_value_name: tableDataItem.ay_prop_value_name, // 输入的id
            platform_prop_value_id: tableDataItem.platform_prop_value_id,
            platform_prop_value_name: tableDataItem.platform_prop_value_name,
            set_pvalues: setValueList,
        };
        // const key = `${info.ay_cid}+${info.ay_prop_value_id}`;
        // setValueData[key] = itemList;
        setValueData[setValueDataKey] = itemList;
        tableData[selectedIndex].ay_vids = data;
        // if (key) {

        // }
        // console.log(item, '???//');

        // const platforms = item.platforms;

        // 1. 查看是否有值域 没有的话就直接赋值

        //
        // const data = { ...item, map_vids: item.platforms };
        // const { selectedIndex, tableData, setValueData } = this.state;
        // // console.log(data, item, lengthNum, '//?????');
        // if (
        //     !tableData[selectedIndex].ay_vids ||
        //     tableData[selectedIndex].ay_vids.length > 1 ||
        //     tableData[selectedIndex].ay_vids[0]?.map_vids.length > 1 ||
        //     item.platforms[0]?.platform ===
        //         tableData[selectedIndex]?.ay_vids[0]?.map_vids[0]?.platform
        // ) {
        //     tableData[selectedIndex].ay_vids = [];
        // }
        // tableData[selectedIndex].ay_vids?.push({ ...data });
        // // const arr = [];
        // const info = tableData[selectedIndex];
        // // tableData[selectedIndex].forEach((item: any) => {
        // const set_pvalues = info.ay_vids?.map((item: any) => {
        //     return {
        //         set_ay_prop_value_id: item.ay_prop_value_id,
        //         set_ay_prop_value_name: item.ay_prop_value_name,
        //     };
        // });
        // const itemList = {
        //     ay_cid: info.ay_cid,
        //     ay_prop_id: info.ay_prop_id,
        //     ay_prop_value_id: info.ay_prop_value_id,
        //     ay_prop_value_name: info.ay_prop_value_name, // 输入的id
        //     platform_prop_value_id: info.platform_prop_value_id,
        //     platform_prop_value_name: info.platform_prop_value_name,
        //     set_pvalues,
        // };
        // const key = `${info.ay_cid}+${info.ay_prop_value_id}`;
        // setValueData[key] = itemList;
        this.setState({ tableData, setValueData });
    };
    /** 切换爱用值域 */
    switchPlatValues = () => {
        const { platValuesStatus } = this.state;
        this.setState({ platValuesStatus: !platValuesStatus });
    };
    /** 选择框dialog */
    selectBoxDialog = () => {
        const { biyaoPlatformData, ayValueList, platValuesStatus } = this.state;
        // 根据必要key找到爱用的值域
        const biyaoKey: string = `${biyaoPlatformData.ay_cid}+${biyaoPlatformData.ay_prop_id}`;
        const ayValueData = ayValueList[biyaoKey];
        // 区分爱用的匹配值域和未匹配值域
        const ayMatch = ayValueData?.ay_match || [];
        const ayNotMatch = ayValueData?.ay_not_match || [];
        const platValues = ayValueData?.plat_values || [];
        const strText = platValuesStatus ? '查看下游平台值域' : '返回爱用值域';
        const strTitle = platValuesStatus ? '请选择爱用值域' : '请选择下游平台原始值域';
        const strTip = platValuesStatus ? '已绑必要的爱用值域不支持重复绑定，如需绑定将会解绑原必要-爱用映射关系！可至下游平台中选择合适值域~' : '支持同时选择爱用值域及下游平台值域';
        return (
            <div className="select-box">
                <div className="select-box-title">
                    {strTitle}:
                    <Tooltip
                        placement="top"
                        title={
                            strTip
                        }
                    >
                        <QuestionCircleOutlined className="question-icon" />
                    </Tooltip>
                    <div
                        className="select-box-title-btn"
                        onClick={this.switchPlatValues}
                    >
                        {strText}{'>>'}
                    </div>
                </div>
                {platValuesStatus ? (
                    <div className="select-box-content">
                        <div className="value-box">
                            {!ayNotMatch.length ? (
                                <div className="value-box-empty">
                                    <Empty description="爱用值域均已绑定，请前往下游平台值域选" />
                                </div>
                            ) : (
                                // @ts-ignore
                                ayNotMatch.map((item, index) => {
                                    const text = item.platforms
                                    // @ts-ignore
                                        .map((item) => platforms_Map[item])
                                        .join(',');

                                    return (
                                        <div
                                            className="items"
                                            onClick={() =>
                                                this.clickAyValue(item)
                                            }
                                            key={index}
                                        >
                                            {item.ay_prop_value_name}({text})
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="value-box">
                            {!ayMatch.length ? (
                                <div className="value-box-empty">
                                    <Empty />
                                </div>
                            ) : (
                                ayMatch.map((item: any, index: number) => {
                                    // 转换平台名称
                                    const platformMatchList =
                                        item.platforms.filter(
                                            (info: string) => info !== 'BIYAO'
                                        );
                                    const text = platformMatchList
                                        // @ts-ignore
                                        .map((info: string) => platforms_Map[info])
                                        .join(',');
                                    return (
                                        <div
                                            className="items selected"
                                            onClick={() => {
                                                // 问是否继续
                                                Modal.confirm({
                                                    title: '提示',
                                                    content:
                                                        '所选爱用值域已绑必要值域，不支持重复绑定。如需绑定将会解绑原值域映射关系！是否继续绑定？',
                                                    okText: '确定',
                                                    cancelText: '取消',
                                                    onOk: () => {
                                                        this.clickAyValue(item);
                                                    },
                                                });
                                            }}
                                            key={index}
                                        >
                                            {item.ay_prop_value_name}({text})-
                                            {item.platform_prop_value_name}(
                                            {platforms_Map.BIYAO})
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="select-box-content">
                        {!isEmpty(platValues) ? (
                            Object.keys(platValues).map((key, index) => {
                                return (
                                    <div className="value-box" key={index}>
                                        {platValues[key].map((info: any) => {
                                            return (
                                                <div
                                                    className="items"
                                                    key={
                                                        info.platform_prop_value_id
                                                    }
                                                    onClick={this.clickAyValue.bind(
                                                        this,
                                                        info,
                                                        key
                                                    )}
                                                >
                                                    {
                                                        info.platform_prop_value_name
                                                    }
                                                    (
                                                    {
                                                        // @ts-ignore
                                                        platforms_Map[key]
                                                    }
                                                    )
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="value-box-empty">
                                <Empty />
                            </div>
                        )}
                    </div>
                )}
                <span
                    className={'close-outlined'}
                    onClick={this.closeSelectDialog}
                >
                    <CloseOutlined />
                </span>
            </div>
        );

        //-------------------------------------------------
        // const ayMatchName = ayMatch.map()
        // const item: any = [];
        // for (const key in ayValueData) {
        //     item.push(ayValueData[key]);
        // }
        // const allData: any = {
        //     allList: [],
        //     douList: [],
        //     kuaiList: [],
        // };
        // item.forEach((item: any) => {
        //     // @ts-ignore
        //     const platforms = item.platforms?.map((item: any) => platforms_Map[item.platform]);
        //     const text = `${item.ay_prop_value_name}(${platforms?.join(',')})`;
        //     if (/.抖.快/.test(text)) {
        //         allData.allList.push({ text, item });
        //     } else if (/.抖/.test(text)) {
        //         allData.douList.push({ text, item });
        //     } else if (/.快/.test(text)) {
        //         allData.kuaiList.push({ text, item });
        //     }
        // });
        // const arr = Object.keys(allData).map(key => allData[key]);
        // // const isEmpty = arr.every(item => !item.length);
        // const valueMaxList = arr.filter(item => item.length);
        // return <div className='select-box'>
        //     <div className='select-box-title'>
        //         请选择爱用值域:
        //         <Tooltip placement="top" overlayStyle={{ minWidth: '370px' }} title={'已绑必要的爱用值域不支持重复绑定，如需绑定将会解绑原必要-爱用映射关系！可至下游平台中选择合适值域~ '}>
        //             <QuestionCircleOutlined className='question-icon'/>
        //         </Tooltip>
        //         <div className='select-box-title-btn'>查看下游平台值域{'>>'}</div>
        //     </div>
        //     <div className='value-box'>
        //         {
        //             !valueMaxList.length ? <div>暂无匹配值域</div> : arr.map((item, index) => {
        //                 if (!item.length) {
        //                     return null;
        //                 }
        //                 return <div className='items-box' key={index}>
        //                     <div className='items'>
        //                         {
        //                             item.map((info: any, ind: number) => {
        //                                 return <span className='item' key={ind} onClick={this.clickAyValue.bind(this, info.item, valueMaxList.length)}>{info.text}</span>;
        //                             })
        //                         }
        //                     </div>
        //                 </div>;
        //             })
        //         }
        //     </div>
        //     <span className={'close-outlined'} onClick={this.closeSelectDialog}><CloseOutlined /></span>
        // </div>;
    };
    footerRender = () => {
        return (
            <div className="footer-render async-data-footer">
                <Button onClick={this.closeDialog}>取消</Button>
                <Button type={'primary'} onClick={this.handleSyncData}>
                    同步数据
                </Button>
            </div>
        );
    };
    onCheck = (checkedKeys: string[], event: any) => {
        const selectData = getID(event.checkedNodes, '', '');
        this.setState({ selectData, checkedKeys });
    };
    closeDialog = () => {
        this.setState({
            treeDataVisible: false,
            selectData: [],
            checkedKeys: [],
        });
    };
    onDropdownVisibleChange = (val: boolean) => {
        if (!val) {
            const { searchData } = this.state;
            if (!searchData.leimuValue.length) {
                // 处理下全部清空的情况
                searchData.leimuValue = [DEFAULT_CATEGORY];
                // 找到美妆的类目
                searchData.cids = this.getDefaultCids();
            }
            // searchData[type] = selectedData;
            searchData.pageSize = 20;
            searchData.pageNo = 1;
            this.setState({ searchData }, () => {
                this.handleSearch();
            });
        }
    };
    /** 清除爱用值域名字 */
    removeAiyongAttributeInputValue = (index: number, item: any) => {
        const { tableData, setValueData } = this.state;
        const tableDataItem = tableData[index];
        tableData[index].ay_vids?.pop();
        const key = `${item.ay_cid}+${item.ay_prop_value_id}`;
        if (!setValueData[key]) {
            setValueData[key] = {
                ay_cid: tableDataItem.ay_cid,
                ay_prop_id: tableDataItem.ay_prop_id,
                ay_prop_value_id: tableDataItem.ay_prop_value_id,
                ay_prop_value_name: tableDataItem.ay_prop_value_name, // 输入的id
                platform_prop_value_id: tableDataItem.platform_prop_value_id,
                platform_prop_value_name:
                    tableDataItem.platform_prop_value_name,
                set_pvalues: tableData[index].ay_vids || [],
            };
        }
        setValueData[key] = {
            ...setValueData[key],
            set_pvalues: tableData[index].ay_vids,
        };
        this.setState({ tableData, setValueData, selectedIndex: index });
    };
    render(): React.ReactNode {
        const {
            categoryoptions,
            searchData,
            searchInputValue,
            selectBoxVisible,
            tableData,
            editorStatus,
            total,
            selectData,
            checkedKeys,
            treeData,
            treeDataVisible,
            spinning,
            ayAttributeName,
        } = this.state;
        const isAllChecked = tableData.every((item: any) => item.checked);
        const num = tableData.filter((item: any) => item.checked).length || 0;
        return (
            <div className="domain-tool-render">
                {/** 同步属性头部 */}
                <SyncAttributeTitle
                    editorStatus={editorStatus}
                    handleEditorAttribute={this.handleEditorAttribute}
                    treeData={categoryoptions}
                ></SyncAttributeTitle>
                {/** 搜索栏 */}
                <div className="log-search">
                    <div className="search-left">
                        <Cascader
                            style={{ width: '300px' }}
                            options={categoryoptions}
                            onChange={this.handleChange.bind(
                                this,
                                'leimuValue'
                            )}
                            allowClear={false}
                            multiple
                            maxTagCount="responsive"
                            fieldNames={{
                                label: 'categoryName',
                                value: 'categoryId',
                            }}
                            value={searchData.leimuValue}
                            showCheckedStrategy={'SHOW_CHILD'}
                            onDropdownVisibleChange={
                                this.onDropdownVisibleChange
                            }
                        />
                        <Select
                            style={{ width: '200px' }}
                            onChange={this.handleChange.bind(
                                this,
                                'showNotMatch'
                            )}
                            placeholder={'仅看必要待补属性'}
                            options={biyaoMapDomainOptions}
                            value={searchData.showNotMatch}
                        />
                        <Search
                            placeholder="搜索爱用属性名字"
                            value={ayAttributeName}
                            onChange={this.changeInputValue.bind(
                                this,
                                'ayAttributeName'
                            )}
                            onSearch={this.handleChange.bind(this, 'pname')}
                            enterButton
                        />
                        <Search
                            placeholder="搜索值域名字"
                            value={searchInputValue}
                            onChange={this.changeInputValue.bind(
                                this,
                                'searchInputValue'
                            )}
                            onSearch={this.handleChange.bind(this, 'vname')}
                            enterButton
                        />
                    </div>
                    <Button onClick={this.initSearchData}>重置</Button>
                </div>
                {/** 表格 */}
                <div
                    className={`log-table ${
                        selectBoxVisible && editorStatus ? 'table-small' : ''
                    }`}
                >
                    <div className="log-data" id="logData">
                        <Spin spinning={spinning}>
                            <div className="table-title">
                                {DomainToolTableTitle.map((item) => {
                                    return (
                                        <div
                                            className={item.value}
                                            key={item.value}
                                        >
                                            {item.name}
                                        </div>
                                    );
                                })}
                            </div>
                            {tableData.map((item: any, index: number) => {
                                // 处理爱用值域名字
                                const textList = item.ay_vids?.map(
                                    (data: any) => {
                                        // @ts-ignore
                                        const platform = data.platforms?.map(
                                            // @ts-ignore
                                            (item) => platforms_Map[item]
                                        );
                                        return `${
                                            data.ay_prop_value_name
                                        }(${platform?.join(',')})`;
                                    }
                                );
                                const ayText = textList?.join(',');
                                return (
                                    <div className="table-item" key={index}>
                                        <div
                                            className={
                                                'parent_cnames parent_cnames-checkbox'
                                            }
                                        >
                                            {!editorStatus &&
                                            !selectBoxVisible ? (
                                                <Checkbox
                                                    checked={item.checked}
                                                    onChange={this.changeCheckbox.bind(
                                                        this,
                                                        index
                                                    )}
                                                    className="parent_cnames-checkbox"
                                                >
                                                    <span
                                                        className={
                                                            'parent_cnames-text'
                                                        }
                                                    >
                                                        {item.parent_cnames}
                                                    </span>
                                                </Checkbox>
                                            ) : (
                                                <span
                                                    className={
                                                        'parent_cnames-text'
                                                    }
                                                >
                                                    {item.parent_cnames}
                                                </span>
                                            )}
                                        </div>
                                        <div className={'platform_prop_name'}>
                                            {item.platform_prop_name}
                                        </div>
                                        <div className={'platform_prop_id'}>
                                            {item.platform_prop_id}
                                        </div>
                                        <div
                                            className={
                                                'platform_prop_value_name'
                                            }
                                        >
                                            {item.platform_prop_value_name}
                                        </div>
                                        <div className={'ay_vids'}>
                                            {editorStatus ? (
                                                <div>
                                                    <input
                                                        placeholder={'请选择'}
                                                        id={`aiyongAttributeInput${index}`}
                                                        readOnly={true}
                                                        value={ayText}
                                                        onFocus={this.onFocusBiyaoAttributeInput.bind(
                                                            this,
                                                            index,
                                                            item
                                                        )}
                                                        onBlur={
                                                            this
                                                                .onBlurBiyaoAttributeInput
                                                        }
                                                    ></input>
                                                    {ayText && (
                                                        <span
                                                            className="remove-icon"
                                                            onClick={this.removeAiyongAttributeInputValue.bind(
                                                                this,
                                                                index,
                                                                item
                                                            )}
                                                        >
                                                            <CloseCircleOutlined />
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span
                                                    onClick={() => {
                                                        if (!ayText) {
                                                            return message.warning(
                                                                '点击上方按钮启动编辑模式'
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {ayText || '-'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="platforms">
                                            {item.platforms?.map(
                                                (
                                                    item: { platform: string },
                                                    index: number
                                                ) => {
                                                    // @ts-ignore
                                                    const imgUrl = PLATFORM_IMG[item.platform.toLowerCase()] || PLATFORM_IMG[IMG_NAME[findKey(item.platform)]];
                                                    return (
                                                        <img
                                                            key={index}
                                                            src={
                                                                imgUrl
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </Spin>
                    </div>
                </div>
                {/** 翻页器 */}
                <div className="log-paging">
                    <div style={{ marginLeft: '33px' }}>
                        <Checkbox
                            checked={isAllChecked}
                            onChange={this.changeAllCheckbox.bind(this)}
                        >
                            全选本页({`${num}/${total}`})
                        </Checkbox>
                        <Button
                            type={'primary'}
                            onClick={() => {
                                if (num === 0) {
                                    return message.warning('请先勾选类目属性');
                                }
                                this.hadleBatchBind();
                            }}
                        >
                            应用其它类目
                        </Button>
                    </div>
                    <ConfigProvider locale={zh_CN}>
                        <Pagination
                            onChange={this.changePage}
                            total={total}
                            current={searchData.pageNo}
                            pageSize={searchData.pageSize}
                        />
                    </ConfigProvider>
                </div>
                {/** 选择框 */}
                {selectBoxVisible && editorStatus && this.selectBoxDialog()}
                <Modal
                    title="同步数据"
                    open={treeDataVisible}
                    footer={this.footerRender()}
                    onCancel={this.closeDialog}
                >
                    {
                        // @ts-ignore
                        treeTransferRender(treeData, selectData, checkedKeys, this.onCheck, true)
                    }
                </Modal>
            </div>
        );
    }
}

export default DomainTool;
