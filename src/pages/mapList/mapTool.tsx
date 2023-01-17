import React from 'react';
import {
    Button, Checkbox, Input, Select, Cascader, Pagination, message, ConfigProvider, Spin
} from 'antd';
import { CloseOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Clipboard from 'clipboard';
import { getCategoryOptions } from "../commodityManagement/api";
import {
    attributeTypeOptions, biyaoWaitingSupplementOptions, customizeOptions, DEFAULT_CATEGORY, findSonByRecursion, MapToolTableTitle
} from './index';
import './index.scss';
import SyncAttributeTitle from '../../components/syncAttributeTitle';
import { getPropsMapList, searchPropName, setPropsBindRelation } from '../../../api/mulitemtransfromApi';
import zh_CN from 'antd/es/locale/zh_CN';
import BirthRecommendDomainDialog from './component/birthRecommendDomainDialog';
import BatchBindDialog from './component/batchBindDialog';
import SettingFixedValueDialog from './component/settingFixedValueDialog';
import CheckFixedValueDialog from './component/checkFixedValueDialog';

const { Search } = Input;

interface IProps {}
interface IState {
    /** 编辑状态 */
    editorStatus: boolean;
    /** 选择盒子可见 */
    selectBoxVisible: boolean;
    /** 选中的input下标 */
    selectedIndex: number | null;
    /** 类目信息 */
    categoryoptions: any;
    /** 值域信息弹框 */
    rangeInfoDialgoVisible: boolean;
    /** 复制值域弹框 */
    copeDomainDialogVisible: boolean;
    tableData: any;
    biyaoPlatformData: any;
    // cascaderValue: any;
    searchData: any;
    total: number;
    /** 搜索input内容 */
    searchInputValue: string;
    /** 批量绑定弹框 */
    batchBindDialogVisible: boolean;
    batchBindSearchResult: any;
    /** 推荐属性名字 */
    recommendedValueName: string;
    /** 加载状态 */
    spinning: boolean;
    setValueData: any;
    /** 设置固定值弹框 */
    settingFixedValueDialogVisible: boolean;
    /** 需要设置绑定的数据 */
    settingFixedValueList: any[];
    checkFixedValueDialogVisible: boolean;
    checkFixedValueDialogData: any;

}

/** 映射工具 */
class MapTool extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            editorStatus: false,
            selectBoxVisible: false,
            selectedIndex: null,
            categoryoptions: [],
            rangeInfoDialgoVisible: false,
            copeDomainDialogVisible: false,
            tableData: [],
            biyaoPlatformData: [],
            // cascaderValue: [],
            total: 0,
            searchInputValue: '',
            searchData: {
                pageNo: 1,
                pageSize: 20,
            },
            batchBindDialogVisible: false,
            batchBindSearchResult: null,
            recommendedValueName: '',
            spinning: true,
            setValueData: {},
            settingFixedValueDialogVisible: false,
            settingFixedValueList: [],
            checkFixedValueDialogVisible: false,
            checkFixedValueDialogData: {},
        };
    }
    async componentDidMount () {
        // 获取类目数据
        const categoryoptions: any = await getCategoryOptions();
        if (!categoryoptions.length) {
            return;
        }
        // 默认选中美妆类
        this.setState({ categoryoptions }, () => {
            this.initSearchData();
        });
    }
    /**
     * 初始化搜索数据
     */
    initSearchData = () => {
        const searchData = {
            pageNo: 1,
            pageSize: 20,
            leimuValue: [DEFAULT_CATEGORY],
            cids: this.getDefaultCids(),
        };
        this.setState({ searchData, searchInputValue: '' }, () => {
            this.handleSearch();
        });
    }

    /** 获取初始化搜索cids */
    getDefaultCids = () => {
        const { categoryoptions } = this.state;
        const defaultData = categoryoptions.filter((item: any) => item.categoryId === DEFAULT_CATEGORY);
        const cids: any = [];
        return findSonByRecursion(defaultData, cids);
    }
    /**
     * 改变选择器
     * @returns
     */
    handleChange = (type: string, val: any) => {
        const selectedData: any = val;
        const { searchData } = this.state;
        if (type === 'leimuValue') {
            const newCids = val?.map((item: any) => item[item?.length - 1]) || [];
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
    }
    /**
     * 编辑属性
     */
    handleEditorAttribute = async (val: any, type: any) => {
        // 保存
        if (type === '保存设置') {
            const { setValueData } = this.state;
            const arr = Object.keys(setValueData).map(key => setValueData[key]);
            if (!arr.length) {
                this.setState({ editorStatus: val, setValueData: {}  });
                return;
            }
            const res = await setPropsBindRelation(arr);
            message.warning(`${res.suc_result.length}个类目绑定成功，${res.fail_result.length}个类目绑定失败`);
        }
        this.setState({ editorStatus: val });
    }
    /**
     * 必要input框失去焦点
     * @returns
     */
    onBlurBiyaoAttributeInput = () => {
        // this.setState({ selectBoxVisible: false });
    }
    /**
     * 必要input框获取焦点
     * @returns
     */
    onFocusBiyaoAttributeInput = (index: number, item: any) => {
        this.setState({ selectBoxVisible: true, selectedIndex: index, biyaoPlatformData: item });
    }
    changeCheckbox = (index: number, val: any) => {
        const { tableData } = this.state;
        tableData[index] = { ...tableData[index], checked: val.target.checked };
        this.setState({ tableData });
    }
    changeAllCheckbox = (val: any) => {
        const { tableData } = this.state;
        tableData.forEach((item: any) => {
            if (!item.is_default) {
                item.checked = val.target.checked;
            }
        });
        this.setState({ tableData });
    }
    /**
     * 关闭选择属性弹框
     */
    closeSelectDialog = () => {
        this.setState({ selectBoxVisible: false });
    }

    /**
     * 值域信息
     */
    handleRangeInfo = (biyaoPlatformData: any) => {
        this.setState({ rangeInfoDialgoVisible: true, biyaoPlatformData });
    }

    /**
     * 处理复制值域信息
     */
    handleCopeDomainInfo = () => {
        const copy = new Clipboard('.copy-btn');
        copy.on('success', e => {
            message.success('复制成功');
            e.clearSelection();
        });
        copy.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }
    /** 关闭批量绑定弹框 */
    closeBatchBindDialog = () => {
        this.setState({ batchBindDialogVisible: false });
    }
    /**
     * 改变分页器
     */
    changePage = (pageNo: number, pageSize: number) => {
        const { searchData } = this.state;
        // // 编辑状态不给调接口
        // if (editorStatus) {
        //     message.warning('您现在处于编辑状态， 请先保存');
        //     return;
        // }
        this.setState({ searchData: { ...searchData, pageNo, pageSize } }, () => {
            this.handleSearch();
        });
    }
    /**
     * 关闭复制值域弹框
     */
    closeCopeDomainDialog = () => {
        this.setState({ rangeInfoDialgoVisible: false });
    }

    /**
     * 选中必要类目属性
     */
    changeItemPlatform = (item: any) => {
        const { tableData, selectedIndex, setValueData } = this.state;
        // console.log(item, '??????');
        // if (item.is_default) {
        //     // this.changeItemPlatform(item);
        //     // @ts-ignore
        //     const id = document.getElementById(`biyaoAttributeInput${selectedIndex + 3}`);
        //     if (id) {
        //         id?.focus();
        //         const logData: any = document.getElementById('logData');
        //         logData.scrollTop = id;
        //     } else {
        //         this.setState({ selectBoxVisible: false });
        //     }
        //     return;
        // }
        // @ts-ignore
        tableData[selectedIndex].platform_prop_id = item.platform_prop_id;
        // @ts-ignore
        tableData[selectedIndex].platform_prop_name = item.platform_prop_name;
        // @ts-ignore
        // @ts-ignore
        const info = tableData[selectedIndex];
        const key = `${info.ay_cid}+${info.ay_prop_id}`;
        setValueData[key] = {
            ay_cid: item.ay_cid,
            ay_prop_id: info.ay_prop_id,
            ay_prop_name: info.ay_prop_name,
            platform_prop_id: item.platform_prop_id, // 输入的id
            platform_prop_name: item.platform_prop_name,
        };
        const logData: any = document.getElementById('logData');
        // @ts-ignore
        const index = this.handleId(selectedIndex);
        const id = document.getElementById(`biyaoAttributeInput${index}`);
        if (id) {
            id?.focus();
            logData.scrollTop += 50;
        } else {
            this.setState({ selectBoxVisible: false });
        }
        this.setState({ tableData, setValueData });
    }
    handleId = (selectedIndex: number) => {
        let index = selectedIndex + 1;
        const { tableData } = this.state;
        let item = tableData[index] || {};
        while (item.is_default) {
            index += 1;
            item = tableData[index] || {};
            if (!item.is_default) {
                return index;
            }
        }
        return index;
    }
    /**
     * 改变input值
     */
    changeInputValue = (event: any) => {
        let value = event.target.value;
        if (value) {
            value = value.trim();
        }
        this.setState({ searchInputValue: value });
    }
    /** 真正开始处理搜索 */
    handleSearch = async () => {
        const { searchData } = this.state;
        const cids = searchData.cids.join(',');
        const res:any = await getPropsMapList({ ...searchData, cids });
        const tableData = res.props?.map((item: any) => {
            return { ...item, checked: false };
        }) || [];
        this.setState({ tableData, total: res.total, spinning: false });
    }
    hadleBatchBind = () => {
        const { tableData } = this.state;
        const selectedList = tableData.filter((item: any) => item.checked);
        // 没有选中
        if (!selectedList.length) {
            return message.warning('请勾选需要绑定的类目');
        }
        // 选中的爱用类目不同
        const ayPropNameList = selectedList.map((item: any) => item.ay_prop_name);
        const isSame = ayPropNameList.every((item: any) => item === ayPropNameList[0]);
        if (!isSame) {
            return message.warning('请勾选相同的爱用属性进行批量绑定');
        }
        this.setState({ batchBindDialogVisible: true });
    }
    getClipboardText = (arr: any, name: any) => {
        const text = `${name}`;
        let text2 = arr?.map((item: any) => {
            return item.ay_prop_value_name;
        }).join('\n');
        text2 = `\n ${text2}`;
        return text + text2;
    }
    /**
     * 修改推荐值域名字
     * @returns
     */
    changeRecommendedValueName = (event: any) => {
        this.setState({ recommendedValueName: event.target.value });
    }
    /**
     * 搜索批量绑定属性
     * @returns
     */
    searchBatchBindAttribute = async (platformPropId: string) => {
        if (!platformPropId) {
            return message.warning('请先输入属性ID');
        }
        const { tableData } = this.state;
        const cidsList = tableData.filter((item: any) => item.checked).map((item: any) => item.platform_cid);
        const cids = cidsList.join(',');
        const res = await searchPropName({ cids, platformPropId  });
        if (!res.platform_prop_id) {
            return this.setState({ batchBindSearchResult: {} });
        }
        const batchBindSearchResult = {
            ...res,
            platform_prop_id: platformPropId,
        };
        this.setState({ batchBindSearchResult });
    }
    /**
     * 提交绑定
     * @returns
     */
    submitBind = async () => {
        const { tableData, batchBindSearchResult } = this.state;
        if (!batchBindSearchResult?.platform_prop_id) {
            return message.warning('请先搜索属性ID');
        }
        const cidsList = tableData.filter((item: any) => item.checked && !item.is_default);
        const setPropsData: any = [];
        cidsList.forEach((item: any) => {
            setPropsData.push({
                ay_cid: item.ay_cid,
                ay_prop_id: item.ay_prop_id,
                ay_prop_name: item.ay_prop_name,
                platform_prop_id: batchBindSearchResult.platform_prop_id, // 输入的id
                platform_prop_name: batchBindSearchResult.platform_prop_name,
            });
        });
        const res = await setPropsBindRelation(setPropsData);
        message.warning(`${res.suc_result.length}个类目绑定成功，${res.fail_result.length}个类目绑定失败`);
        this.setState({ batchBindSearchResult: null, batchBindDialogVisible: false }, () => {
            this.handleSearch();
        });
    }
    /** 处理批量绑定的回调 */
    handleBatchBindDialogCallback = (type: string, value: string = '') => {
        if (type === 'close') {
            this.closeBatchBindDialog();
        } else if (type === 'submit') {
            this.submitBind();
        } else if (type === 'search') {
            this.searchBatchBindAttribute(value);
        }
    }
    onDropdownVisibleChange = (val: boolean) => {
        if (!val) {
            const { searchData } = this.state;
            if (!searchData.leimuValue.length) {
                // 处理下全部清空的情况
                searchData.leimuValue = [DEFAULT_CATEGORY];
                // 找到美妆的类目
                searchData.cids = this.getDefaultCids();
            }
            searchData.pageSize = 20;
            searchData.pageNo = 1;
            this.setState({ searchData }, () => {
                this.handleSearch();
            });
        }
    }
    /** 清除爱用值域名字 */
    removeAiyongAttributeInputValue = (index: number, item: any) => {
        const { tableData, setValueData } = this.state;
        tableData[index].platform_prop_name = '';
        tableData[index].platform_prop_id = '';
        const key = `${item.ay_cid}+${item.ay_prop_id}`;
        if (!setValueData[key]) {
            setValueData[key] = {
                ay_cid: item.ay_cid,
                ay_prop_id: tableData[index].ay_prop_id,
                ay_prop_name: tableData[index].ay_prop_name,
                platform_prop_id: '', // 输入的id
                platform_prop_name: '',
            };
        } else  {
            setValueData[key] = {
                ...setValueData[key],
                platform_prop_id: '', // 输入的id
                platform_prop_name: '',
            };
        }
        this.setState({ tableData, setValueData, selectedIndex: index });
    };
    handleSettingFixedValue = () => {
        const { tableData } = this.state;
        const selectedList = tableData.filter((item: any) => item.checked);
        // 没有选中
        if (!selectedList.length) {
            return message.warning('请勾选需要设置的类目');
        }
        // 选中的爱用类目不同
        const ayPropNameList = selectedList.map((item: any) => item.ay_prop_name);
        const isSame = ayPropNameList.every((item: any) => item === ayPropNameList[0]);
        if (!isSame) {
            return message.warning('请勾选相同的爱用属性进行操作');
        }
        this.setState({ settingFixedValueDialogVisible: true, settingFixedValueList: selectedList });
    }
    /** 关闭设置固定值弹框 */
    closeSettingFixedValueDialog = (type = '') => {
        if (type === 'refresh') {
            this.handleSearch();
        }
        this.setState({ settingFixedValueDialogVisible: false });
    }
    /** 查看固定值 */
    checkFixedValue = (item: any) => {
        const data = {
            aycid: item.ay_cid,
            aypid: item.ay_prop_id,
            ayname: item.ay_prop_name,
        };
        this.setState({ checkFixedValueDialogVisible: true, checkFixedValueDialogData: data });
    }
    closeCheckFixedValueDialog = () => {
        this.setState({ checkFixedValueDialogVisible: false });
    }
    render (): React.ReactNode {
        const {
            editorStatus,
            selectBoxVisible,
            categoryoptions,
            rangeInfoDialgoVisible,
            tableData, biyaoPlatformData,
            searchData, total, searchInputValue, batchBindDialogVisible, batchBindSearchResult, recommendedValueName, spinning, settingFixedValueDialogVisible, settingFixedValueList, checkFixedValueDialogVisible, checkFixedValueDialogData,
        } = this.state;
        const copyName = recommendedValueName || biyaoPlatformData.ay_prop_name;
        const num = tableData.filter((item: any) => item.checked).length || 0;
        const isAllChecked = tableData.every((item: any) => item.checked || item.is_default);
        const biyaoPlatformList = biyaoPlatformData.platform_props_data;
        // 是否是公共值域
        const isPublic = biyaoPlatformData.ay_pvalues_data?.every((item: any) => item.platform);
        // 公共值域数组
        let domainData = null;
        if (isPublic) {
            domainData = biyaoPlatformData.ay_pvalues_data;
        }
        const copyInputData = (domainData && domainData?.length ? domainData : biyaoPlatformData.ay_pvalues_data) || null;
        return <div className="map-Tool">
            { editorStatus &&  selectBoxVisible && <div className='select-box'>
                <span className={'line'}></span>
                <div className={'select-box-left'}>
                    <div className='domain-key'>
                        <span>需绑定爱用属性:</span>
                        <span>属性值域:</span>
                    </div>
                    <>
                        <div className='domain-attribute'>
                            <div className='attribute-title'>
                                <span>{biyaoPlatformData.ay_prop_name}</span>
                                <span className='customize'>{biyaoPlatformData.custom_flag === '1' ? '可自定义' : '不可自定义'}</span>
                                <span className='select'>{biyaoPlatformData.type}</span>
                            </div>
                            {/* 属性值域: */}
                            <div className='domain-name'>
                                {
                                    biyaoPlatformData.ay_pvalues_data?.map((item: any) => {
                                        return <span key={item.ay_prop_value_id}>{item.ay_prop_value_name}</span>;
                                    })
                                }
                            </div>
                        </div>
                    </>
                </div>
                <div className={'select-box-right'}>
                    <p>请选择必要类目属性：</p>
                    <span className={'line'}></span>
                    <div className='select-box-right-info'>
                        {
                            biyaoPlatformList.map((item: any, index: number) => {
                                return <div className={'select-box-item'} key={index} onClick={this.changeItemPlatform.bind(this, item)}>
                                    <span>{item.platform_prop_id}</span>
                                    <span>{item.platform_prop_name}</span>
                                </div>;
                            })
                        }
                    </div>
                </div>
                <span className={'close-outlined'} onClick={this.closeSelectDialog}><CloseOutlined /></span>
            </div>}
            <SyncAttributeTitle treeData={categoryoptions}  editorStatus={editorStatus} handleEditorAttribute={this.handleEditorAttribute} ></SyncAttributeTitle>

            <div className='log-search'>
                <div className='search-left'>
                    <Cascader style={{ width: '300px' }}
                        options={categoryoptions}
                        onChange={this.handleChange.bind(this, 'leimuValue')}
                        allowClear={false}
                        multiple
                        maxTagCount="responsive"
                        fieldNames={{ label: 'categoryName', value: 'categoryId' }}
                        value={searchData.leimuValue}
                        showCheckedStrategy={'SHOW_CHILD'}
                        onDropdownVisibleChange={this.onDropdownVisibleChange}
                    />
                    <Select
                        style={{ width: '200px' }}
                        onChange={this.handleChange.bind(this, 'showNotMatch')}
                        placeholder={'仅看必要待补属性'}
                        options={biyaoWaitingSupplementOptions}
                        value={searchData.showNotMatch}
                    />
                    <Select
                        style={{ width: '200px' }}
                        onChange={this.handleChange.bind(this, 'customFlag')}
                        placeholder={'请选择是否自定义'}
                        options={customizeOptions}
                        value={searchData.customFlag}
                    />
                    <Select
                        style={{ width: '200px' }}
                        onChange={this.handleChange.bind(this, 'type')}
                        placeholder={'请选择属性类型'}
                        options={attributeTypeOptions}
                        value={searchData.type}
                    />
                    <Search placeholder="搜索爱用属性名字" value={searchInputValue} onChange={this.changeInputValue} onSearch={this.handleChange.bind(this, 'pname')} enterButton/>
                </div>
                <Button onClick={this.initSearchData}>重置</Button>
            </div>
            <div className={`log-table ${editorStatus &&  selectBoxVisible ? 'table-small' : ''}`}>
                <div className='log-data' id='logData'>
                    <Spin spinning={spinning}>
                        <div className='table-title'>
                            {
                                MapToolTableTitle.map(item => {
                                    return <div className={item.value} key={item.value}>{item.name}</div>;
                                })
                            }
                        </div>
                        {
                            tableData.map((item: any, index: number) => {
                                // 是否可自定义
                                const canCustomize = !!item.ay_pvalues_data?.length;
                                const type = attributeTypeOptions.filter(data => data.value === item.type).map(key => key.label);
                                return <div className={`table-item ${item.is_default ? 'item-display' : ''}`} key={index} onClick={ () => {
                                    // if (item.is_default) {
                                    //     message.warning('属性已做写死处理，无法修改');
                                    // }
                                }}>
                                    <div className={'parent_cnames parent_cnames-checkbox'}>
                                        <Checkbox disabled={item.is_default} checked={item.checked && !item.is_default} onChange={this.changeCheckbox.bind(this, index)} className='parent_cnames-checkbox'>
                                            <span className={'parent_cnames-text'}>{item.parent_cnames}</span>
                                        </Checkbox>
                                    </div>
                                    <div className={'platform_prop_id'}>
                                        {
                                            editorStatus
                                                ? <input id={`biyaoAttributeInput${index}`}
                                                    disabled={item.is_default}
                                                    placeholder={'请选择'} readOnly={true} value={item.platform_prop_id || ''}
                                                    onFocus={this.onFocusBiyaoAttributeInput.bind(this, index, item)}
                                                    onBlur={this.onBlurBiyaoAttributeInput}></input>
                                                : <span onClick={() => {
                                                    if (!editorStatus && !item.is_default) {
                                                        return message.warning('点击上方按钮启动编辑模式');
                                                    }
                                                    if (item.is_default) {
                                                        message.warning('属性已设置固定值不支持修改');
                                                    }
                                                }}>{item.platform_prop_id || '-'}</span>
                                        }
                                    </div>
                                    <div className={'platform_prop_name'}>
                                        {
                                            editorStatus ? <input id={`biyaoAttributeInput${index}`}disabled={item.is_default} placeholder={'请选择'} readOnly={true} value={item.platform_prop_name || ''}  onFocus={this.onFocusBiyaoAttributeInput.bind(this, index, item)} onBlur={this.onBlurBiyaoAttributeInput}></input> : <span onClick={() => {
                                                if (!editorStatus && !item.is_default) {
                                                    return message.warning('点击上方按钮启动编辑模式');
                                                }
                                                if (item.is_default) {
                                                    message.warning('属性已设置固定值不支持修改');
                                                }
                                            }}>{item.platform_prop_name || '-'}</span>
                                        }
                                        {editorStatus && item.platform_prop_name && !item.is_default && (
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
                                    <div className={'ay_prop_name'}>{item.ay_prop_name}</div>
                                    <div className={'custom_flag'}>{item.custom_flag === '1' ? '可自定义' : '不可自定义'}</div>
                                    <div className={'type'}>{type[0] || ''}</div>
                                    <div className={'caozuo'} onClick={() => {
                                        // if (!canCustomize) {
                                        //     return;
                                        // }
                                        // this.handleRangeInfo(item);
                                    }}>
                                        {item.is_default && item.type !== 'IMAGE' && <span className='caozuo-text' onClick={this.checkFixedValue.bind(this, item)}>查看固定值</span>}
                                        {canCustomize && <span className='caozuo-text' onClick={this.handleRangeInfo.bind(this, item)}>生成推荐值域</span>}
                                        {!canCustomize && !item.is_default && <span>-</span>}
                                    </div>
                                </div>;
                            })
                        }
                    </Spin>
                </div>
            </div>
            <div className='log-paging'>
                <div style={{ marginLeft: '33px' }}>
                    <Checkbox checked={isAllChecked} onChange={this.changeAllCheckbox.bind(this)}>全选本页({`${num}/${total}`})</Checkbox>
                    <Button type={'primary'} onClick={this.hadleBatchBind}>批量绑定</Button>
                    <Button type={'primary'}  className="setting-btn" onClick={this.handleSettingFixedValue}>设置固定值</Button>
                </div>
                <ConfigProvider locale={zh_CN}>
                    <Pagination onChange={this.changePage} total={total} current={searchData.pageNo} pageSize={searchData.pageSize} />
                </ConfigProvider>
            </div>
            {/** 生成推荐值域弹框 */}
            { rangeInfoDialgoVisible && <BirthRecommendDomainDialog handleBirthRecommendDomainDialogCallback={this.closeCopeDomainDialog} defaultRecommendedName={copyName} copyInputData={copyInputData} domainData={domainData} biyaoPlatformData={biyaoPlatformData}></BirthRecommendDomainDialog>}
            {/** 批量绑定弹框 */}
            { batchBindDialogVisible && <BatchBindDialog handleBatchBindDialogCallback={this.handleBatchBindDialogCallback} batchBindSearchResult={batchBindSearchResult}></BatchBindDialog>}
            {/** 设置固定值弹框 */}
            { settingFixedValueDialogVisible && <SettingFixedValueDialog settingFixedValueList={settingFixedValueList} closeSettingFixedValueDialog={this.closeSettingFixedValueDialog}></SettingFixedValueDialog> }
            {/** 查看固定值弹框 */}
            { checkFixedValueDialogVisible && <CheckFixedValueDialog checkFixedValueDialogData={checkFixedValueDialogData} closeCheckFixedValueDialog={this.closeCheckFixedValueDialog}></CheckFixedValueDialog> }
        </div>;
    }
}

export default MapTool;
