// @ts-nocheck
import React from 'react';
import { AutoComplete, Button, Checkbox, ConfigProvider, Input, InputNumber, message, Modal, Pagination, Select, Space, Table } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import { addMultiPlatformAddress, delMultiPlatformAddress, editMultiPlatformAddress, editMultiPlatformAddressBind, getMultiPlatformAddress } from '../../../api/mapToolApi';
import './index.scss';
import { isEmpty } from '../../services/utils';

const { Option } = Select;
const { Search } = Input;
interface AddressToolProps {
    
}

const PLATFORM_OPTIONS = [
    {
        value: 'dy',
        label: '抖音',
    },
    {
        value: 'yz',
        label: '有赞',
    },
    {
        value: 'ks',
        label: '快手',
    },
    {
        value: 'videoShop',
        label: '视频号',
    },
];
let tableList = [];
interface SearchData {
    pageNo: number;
    pageSize: number;
    platform: string;
}
interface AddressToolState {
    /** 增加多平台数据弹框显示 */
    addMultiPlatformAddressDialogVisible: string | null;
    /** 全选按钮状态 */
    isAllChecked: boolean;
    /** 总数 */
    total: number;
    searchData: SearchData;
    dataSource: any;
}

const platformSearchList = ['BY', 'aiyong'];
/** 地址工具页面 */
class AddressTool extends React.Component<AddressToolProps, AddressToolState> {
    constructor(props: AddressToolProps) {
        super(props);
        this.state = { 
            addMultiPlatformAddressDialogVisible: null,
            isAllChecked: false,
            total: 0,
            searchData: {
                pageNo: 1,
                pageSize: 20,
                platform: 'dy',
            },
            dataSource: [],
            aiyongarr: [],
            BYarr: [],
            columns: [
                {
                    title: '必要-省/市/区',
                    dataIndex: 'BYHierarchy',
                    key: 'BYHierarchy',
                    width: 200,
                },
                {
                    title: '爱用-省/市/区',
                    dataIndex: 'aiyongHierarchy',
                    key: 'aiyongHierarchy',
                    width: 200,
                },
                {
                    title: '三级地址id',
                    dataIndex: 'bind_id',
                    key: 'bind_id',
                    width: 100,
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 300,
                    render: (_, record) => (
                        <Space size="middle">
                            <a onClick={this.modifyArddress.bind(this, record, 'by')}>修改必要地址</a>
                            <a onClick={this.modifyArddress.bind(this, record, 'ay')}>修改爱用绑定关系</a>
                            <a onClick={this.delArddress.bind(this, record)}>删除</a>
                        </Space>
                    ),
                },
            ],
            inputValue: {},
        };
    }
    /** 删除地址 */
    delArddress = (record) => {
        const { id, platform } = record;
        Modal.confirm({
            title: '提示',
            content:
                '是否确认删除绑定关系？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.handleDelArddress(id, platform);
            },
        });
    }
    /** 处理删除地址 */
    handleDelArddress = async (id, platform) => {
        const res = await delMultiPlatformAddress({ id, platform });
        if (res !== 'success') {
            return message.error(`删除失败${res}`);
        }
        // 处理一下页面删除
        const { dataSource, searchData } = this.state;
        const newArr = dataSource.filter(item => item.id !== id);
        const arr = JSON.parse(JSON.stringify(dataSource)).splice((searchData.pageNo - 1) * searchData.pageSize, searchData.pageNo * searchData.pageSize);
        if (arr.length === 1) {
            searchData.pageNo = searchData.pageNo - 1 || 1;
        }
        this.setState({ dataSource: newArr, searchData });
        return message.success('删除成功');
    }
    /** 修改地址 */
    modifyArddress = (record, type) => {
        const parentCode = record.parentCode ? record.parentCode : record.parent_code;
        this.setState({ addMultiPlatformAddressDialogVisible: `${type}modify`, inputValue: { parentCode, ...record } });
    }
    componentDidMount (): void {
        this.init();
    }
    /** 初始化 */
    init = () => {
        return new Promise((resolve, reject) => {
            const promiseAll = platformSearchList.map(item => {
                return new Promise<void>((resolve) => {
                    getMultiPlatformAddress({ platform: item }).then(res => {
                        resolve({ [item]: res });
                    });
                });
            });
            Promise.all(promiseAll).then(res => {
                res.forEach(item => {
                    Object.keys(item).map(key => {
                        this.setAddress(item[key], key);
                    });
                });
                resolve('success');
            });
        });
    }
    addArr = () => {
        const { aiyongarr, BYarr } = this.state;
        let newArr = BYarr.map(item => {
            const data = aiyongarr.find(i => item.bind_id == i.id);
            //  去重
            return {
                ...data,
                ...item,
            };
        });
        // const tradeTidSet = new Set();
        // newArr = newArr.filter(item => {
        //     const { id } = item;
        //     if (tradeTidSet.has(id)) {
        //         return false;
        //     }
        //     tradeTidSet.add(id);
        //     return true;
        // });
        tableList = JSON.parse(JSON.stringify(newArr));
        this.setState({ dataSource: newArr });
    }
    /** 设置地址数据 */
    setAddress = (res, key) => {
        const aymap = [];
        Object.keys(res).map(item => {
            const id = key === 'BY' ? item.split(':')[0] : `${item.split(':')[0]}0000`;
            // const id = item.split(':')[0];
            const name = item.split(':')[1] || '';
            // aymap[id + '-1-'+ name] = { id, name };
            // console.log(id, '????res');
            Object.keys(res[item]).map(item2 => {
                const id2 = item2.split(':')[0];
                const name2 = item2.split(':')[1] || '';
                // aymap[id + '-2-'+ name2] = { id: id2, name: name2 };
                // console.log(item2, '????resid2');
                // item2.map(item3 => {
                //     console.log(item3, 'item3');
                // })
                res[item][item2].map(item3 => {
                    // console.log(item, '???item');
                    const id3 = key === 'BY' ? item3.id : item3.id;
                    // aymap[id + '-3-'+ item3.name] = {id: id3, name: item3.name};
                    let data = { [`${key}Hierarchy`]: `${name}/${name2}/${item3.name}`, ...item3, [`${key}provinceName`]: name, [`${key}cityName`]: name2, [`${key}provinceCode`]: id, [`${key}cityCode`]: id2, [`${key}areaName`]: item3.name, [`${key}code`]: item3.code };
                    // if (key === 'BY') {
                    //     data = {
                    //         ...data,
                    //         ...item3,
                    //     };
                    // }
                    aymap.push(data);
                });
            });
        });
        const stateName = `${key}arr`;
        this.setState({ [stateName]: aymap }, () => {
            this.addArr();
        });
    }
    onSearch = (val) => {
        const { searchData } = this.state;
        const arr = tableList.filter(item => item.BYHierarchy.includes(val));
        this.setState({ dataSource: arr, searchData: { pageSize: searchData.pageSize, pageNo: 1 } });
    }
    /** 点击新增多平台数据 */
    clickAddMultiPlatformAddress = () => {
        this.setState({ addMultiPlatformAddressDialogVisible: 'add', inputValue: {} });
    }
    /** 提交新增修改多平台数据 */
    submitAddMultiPlatformAddress = async () => {
        const { inputValue, addMultiPlatformAddressDialogVisible, dataSource } = this.state;
        // {addMultiPlatformAddressDialogVisible
        //     provinceName: '',	// 省
        //     provinceCode: '', // 省编码
        //     cityName: '', 		// 市
        //     cityCode: '' 			// 市编码
        //     areaName: '',   	// 区
        //     areaCode: '',   	// 区编码
        //     platform: '',   	// 平台
        //   }
        let res = {};
        // let newDataSource = dataSource;
        // 校验非空
        if (addMultiPlatformAddressDialogVisible === 'add') {
            const { provinceName = '', provinceCode = '', cityName = '', cityCode = '', areaName = '', areaCode = '' } = inputValue;
            if (!provinceName.trim() || !provinceCode || !cityName.trim() || !cityCode || !areaName.trim() || !areaCode) {
                return message.info('表格请填写完整');
            }
            res = await addMultiPlatformAddress({ ...inputValue, platform: "BY" });
        } else if (addMultiPlatformAddressDialogVisible === 'bymodify') {
            const { name = '', code = '', parentCode = '' } = inputValue;
            if (!name.trim() || !code || !parentCode) {
                return message.info('表格请填写完整');
            }
            res = await editMultiPlatformAddress({ ...inputValue });
        } else if (addMultiPlatformAddressDialogVisible === 'aymodify') {
            res = await editMultiPlatformAddressBind({ ...inputValue, bindId: inputValue.bind_id });
        }

        if (res !== 'success') {
            // newDataSource = dataSource;
            return message.error(res || '操作失败');
        }
        // 修改页面
        setTimeout(() => {
            this.init().then(res => {
                if (res === 'success') {
                    message.success(`${addMultiPlatformAddressDialogVisible === 'add' ? '新增' : '修改'}成功`);
                    this.setState({ addMultiPlatformAddressDialogVisible: null, inputValue: {} });
                }
            });
        }, 500);
    }
    /** 取消新增多平台数据 */
    cancelAddMultiPlatformAddress = () => {
        this.setState({ addMultiPlatformAddressDialogVisible: null, inputValue: {} });
    }
    /** 点击全选按钮 */
    changeAllCheckbox = (val: any) => {
        const checked = val.target.checked;
        this.setState({ isAllChecked: checked });
    }
    /** 改变页码 */
    changePage = (val, size) => {
        this.setState({ searchData: { pageSize: size, pageNo: val } });
    }
    changeInputValue = (type, event) => {
        const { inputValue } = this.state;
        inputValue[type] = event.target.value;
        this.setState({ inputValue });
    }
    changeSelectValue = (type, typeCode,  value, data) => {
        const { inputValue } = this.state;
        inputValue[type] = data[`aiyong${type}`] || value;
        if (data[`aiyong${type}`]) {
            inputValue[typeCode] = value;
        }
        this.setState({ inputValue });
    }
    getOptions = (arr, type, parentdata = {}) => {
        const tradeTidSet = new Set();
        return arr.filter(item => {
            // const { aiyongprovinceCode } = item;
            if (isEmpty(parentdata.value) || item[parentdata.type] === parentdata.value) {
                const key = item[type];
                if (tradeTidSet.has(key)) {
                    return false;
                }
                tradeTidSet.add(key);
                return true;
            }
        });
    }
    /** 改变父级编码 */
    changeParentSelectValue = (type, typeCode, key, value, data) => {
        const { inputValue } = this.state;
        inputValue[type] = value;
        inputValue[typeCode] = data[key] || '';
        // 单独处理一下
        if (type === 'BYcityCode') {
            inputValue.parentCode = value;
        }
        this.setState({ inputValue });
    }
    changeInputNumberValue = (type, value) => {
        const { inputValue } = this.state;
        inputValue[type] = value;
        this.setState({ inputValue });
    }
    render() {
        const { addMultiPlatformAddressDialogVisible, dataSource, columns, inputValue, aiyongarr } = this.state;
        const visible = !!addMultiPlatformAddressDialogVisible;
        return (<div className='address-tool-render'>
            <div className='log-search'>
                <Search
                    placeholder="请输入必要地址名字"
                    allowClear
                    onSearch={this.onSearch}
                    style={{ width: 304 }}
                    enterButton
                />
                <Button type="link" onClick={this.clickAddMultiPlatformAddress}>新增必要地址</Button>
            </div>
            <div className='log-table'>
                <ConfigProvider locale={zh_CN}>
                    <Table rowKey={'id'} scroll={{ y: '100vw'}} columns={columns} dataSource={dataSource} pagination={{ total: dataSource.length, defaultPageSize: 20, pageSizeOptions: ['20', '40', '60', '100'],  showTotal: (total) => `总:${total}` }}/>
                </ConfigProvider>
            </div>
            {/* <div className='log-paging'>
                <ConfigProvider locale={zh_CN}>
                    <Pagination showTotal={(total) => `总:${total}`} onChange={this.changePage} total={dataSource.length} current={searchData.pageNo} pageSize={searchData.pageSize} />
                </ConfigProvider>
            </div> */}
            <Modal className='address-tool-dialog' title={`${addMultiPlatformAddressDialogVisible === 'add' ? '新增' : '修改'}弹框`} open={visible} onOk={this.submitAddMultiPlatformAddress} onCancel={this.cancelAddMultiPlatformAddress} okText={`确认${addMultiPlatformAddressDialogVisible === 'add' ? '新增' : '修改'}`} cancelText={'取消'}>
                {
                    addMultiPlatformAddressDialogVisible === 'add' ? <div className='inputs-box'>
                        <div className='input-item'>
                            <span className='item-label'>省</span>
                            <AutoComplete
                                showSearch
                                style={{
                                    width: 300,
                                }}
                                value={inputValue.provinceName}
                                onChange={this.changeSelectValue.bind(this, 'provinceName', 'provinceCode')}
                                fieldNames={{label: 'aiyongprovinceName', value: 'aiyongprovinceCode'}}
                                placeholder="请输入省"
                                // optionFilterProp="children"
                                filterOption={(input, option) => (option?.aiyongprovinceName ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.aiyongprovinceName ?? '').toLowerCase())
                                }
                                options={this.getOptions(aiyongarr, 'aiyongprovinceCode')}
                            />
                            {/* <Select
                                allowClear={true}
                                showSearch
                                style={{
                                width: 200,
                                }}
                                value={inputValue.provinceName}
                                onChange={this.changeSelectValue.bind(this, 'provinceName', 'provinceCode')}
                                fieldNames={{label: 'aiyongprovinceName', value: 'aiyongprovinceCode'}}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.aiyongprovinceName ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.aiyongprovinceName ?? '').toLowerCase())
                                }
                                options={this.getOptions(aiyongarr, 'aiyongprovinceCode')}
                            /> */}
                            {/* <Input
                                placeholder="请输入省"
                                value={inputValue.provinceName}
                                style={{ width: 304 }}
                                onChange={this.changeInputValue.bind(this, 'provinceName')}
                            /> */}
                        </div>
                        <div className='input-item'>
                            <span className='item-label'>省编码</span>
                            <InputNumber
                                controls={false}
                                placeholder="请输入省编码"
                                value={inputValue.provinceCode}
                                style={{ width: 304 }}
                                onChange={this.changeInputNumberValue.bind(this, 'provinceCode')}
                            />
                        </div>
                        <div className='input-item'>
                            <span className='item-label'>市</span>
                            <AutoComplete
                                showSearch
                                style={{
                                    width: 300,
                                }}
                                value={inputValue.cityName}
                                onChange={this.changeSelectValue.bind(this, 'cityName', 'cityCode')}
                                fieldNames={{label: 'aiyongcityName', value: 'aiyongcityCode'}}
                                placeholder="请输入市"
                                // optionFilterProp="children"
                                filterOption={(input, option) => (option?.aiyongcityName ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.aiyongcityName ?? '').toLowerCase())
                                }
                                options={this.getOptions(aiyongarr, 'aiyongcityCode', { type: 'aiyongprovinceCode', value: inputValue.provinceCode })}
                            >
                                {/* {this.getOptions(aiyongarr, 'aiyongcityCode', { type: 'aiyongprovinceCode', value: inputValue.provinceCode }).map((item: any) => {
                                    return <Option value={item.aiyongcityName} label={item.aiyongcityName} key={item.aiyongcityCode} data-item={item}>{item.aiyongcityName}</Option>
                                })} */}
                            </AutoComplete>
                        </div>
                        <div className='input-item'>
                            <span className='item-label'>市编码</span>
                            <InputNumber
                                controls={false}
                                placeholder="请输入市编码"
                                value={inputValue.cityCode}
                                style={{ width: 304 }}
                                onChange={this.changeInputNumberValue.bind(this, 'cityCode')}
                            />
                        </div>
                        <div className='input-item'>
                            <span className='item-label'>区</span>
                            <AutoComplete
                                showSearch
                                style={{
                                    width: 300,
                                }}
                                value={inputValue.areaName}
                                onChange={this.changeSelectValue.bind(this, 'areaName', 'areaCode')}
                                fieldNames={{label: 'name', value: 'code'}}
                                placeholder="请输入区"
                                // optionFilterProp="children"
                                filterOption={(input, option) => (option?.name ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.name ?? '').toLowerCase())
                                }
                                options={this.getOptions(aiyongarr, 'code', { type: inputValue.cityCode ? 'aiyongcityCode' : 'aiyongprovinceCode', value: inputValue.cityCode ? inputValue.cityCode : inputValue.provinceCode })}
                            />
                            {/* <Select
                                allowClear={true}
                                showSearch
                                style={{
                                    width: 200,
                                }}
                                value={inputValue.areaName}
                                onChange={this.changeSelectValue.bind(this, 'areaName', 'areaCode', inputValue.cityCode)}
                                fieldNames={{label: 'name', value: 'code'}}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.name ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.name ?? '').toLowerCase())
                                }
                                options={this.getOptions(aiyongarr, 'code', { type: inputValue.cityCode ? 'aiyongcityCode' : 'aiyongprovinceCode', value: inputValue.cityCode ? inputValue.cityCode : inputValue.provinceCode })}
                            /> */}
                            {/* <Input
                                placeholder="请输入区"
                                value={inputValue.areaName}
                                style={{ width: 304 }}
                                onChange={this.changeInputValue.bind(this, 'areaName')}
                            /> */}
                        </div>
                        <div className='input-item'>
                            <span className='item-label'>区编码</span>
                            <InputNumber
                                controls={false}
                                placeholder="请输入区编码"
                                value={inputValue.areaCode}
                                style={{ width: 304 }}
                                onChange={this.changeInputNumberValue.bind(this, 'areaCode')}
                            />
                        </div>
                    </div> : addMultiPlatformAddressDialogVisible === 'bymodify' ? <div className='inputs-box'>
                        {/* <div className='input-item'>
                            <span className='item-label'>地址id</span>
                            <Input
                                placeholder="请输入爱用区级地址名字"
                                value={inputValue.id}
                                style={{ width: 304 }}
                                onChange={this.changeInputValue.bind(this, 'id')}
                            />
                        </div> */}
                        <div className='input-item'>
                            <span className='item-label'>地址名</span>
                            <Input
                                value={inputValue.name}
                                placeholder="请输入地址名"
                                style={{ width: 304 }}
                                onChange={this.changeInputValue.bind(this, 'name')}
                            />
                        </div>
                        <div className='input-item'>
                            <span className='item-label'>地址编码</span>
                            <InputNumber
                                controls={false}
                                value={inputValue.code}
                                placeholder="请输入地址编码"
                                style={{ width: 304 }}
                                onChange={this.changeInputNumberValue.bind(this, 'code')}
                            />
                        </div>
                        <div className='input-item'>
                            <span className='item-label'>父级地址编码</span>
                            <AutoComplete
                                showSearch
                                style={{
                                    width: 300,
                                }}
                                // optionLabelProp="aiyongcityCode"
                                value={inputValue.BYcityCode}
                                onChange={this.changeParentSelectValue.bind(this, 'BYcityCode', 'BYcityName', 'aiyongprovinceName')}
                                // fieldNames={{ label: 'aiyongprovinceName', value: 'aiyongprovinceName' }}
                                placeholder="请输入父级地址编码"
                                // optionFilterProp="children"
                                filterOption={(input, option) => (`${option?.key}${option?.aiyongHierarchy}` ?? '').includes(input)}
                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((`${optionB?.key}${optionB?.aiyongHierarchy}` ?? '').toLowerCase())}
                                // options={this.getOptions(aiyongarr, 'aiyongprovinceCode')}
                            >
                                {this.getOptions(aiyongarr, 'aiyongcityCode').map((item: any) => {
                                    return <Option key={item.aiyongcityCode} aiyongprovinceName={item.aiyongcityName} aiyongHierarchy={item.aiyongHierarchy} data-item={item}>{item.aiyongcityCode}-{item.aiyongHierarchy}</Option>;
                                })}
                            </AutoComplete>
                        </div>
                        <div className='input-item'>
                            <span className='item-label'>父级地址名</span>
                            <Input
                                disabled
                                controls={false}
                                value={inputValue.BYcityName}
                                placeholder="请输入父级地址编码"
                                style={{ width: 304 }}
                            />
                        </div>
                    </div> : <div className='inputs-box'>
                        <div className='input-item'>
                            <span className='item-label'>三级地址id</span>
                            <AutoComplete
                                showSearch
                                style={{ width: 300 }}
                                value={inputValue.bind_id}
                                // optionLabelProp="areaCode"
                                filterOption={(input, option) =>  (`${option?.aiyongHierarchy}${option?.key}` ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((`${optionB?.aiyongHierarchy}${optionB?.key}` ?? '').toLowerCase())
                                }
                                onChange={this.changeParentSelectValue.bind(this, 'bind_id', 'aiyongHierarchy', 'aiyongHierarchy')}
                                placeholder="请输入区"
                            >
                                {this.getOptions(aiyongarr, 'code').map((item: any) => {
                                    return <Option key={item.id} aiyongHierarchy={item.aiyongHierarchy}  data-item={item}>{item.aiyongHierarchy}-{item.id} </Option>;
                                })}
                            </AutoComplete>
                            {/* <AutoComplete
                                showSearch
                                style={{
                                    width: 300,
                                }}
                                optionLabelProp="areaCode"
                                onChange={this.changeSelectValue.bind(this, 'areaName', 'areaCode')}
                                fieldNames={{ label: 'name', value: 'code' }}
                                value={inputValue.areaName}
                                // fieldNames={{ label: 'aiyongprovinceName', value: 'aiyongprovinceName' }}
                                // placeholder="请输入父级地址编码"
                                // optionFilterProp="children"
                                // filterOption={(input, option) => (option?.aiyongprovinceName ?? '').includes(input)}
                                // filterSort={(optionA, optionB) =>
                                //     (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.aiyongprovinceName ?? '').toLowerCase())
                                // }
                                // options={this.getOptions(aiyongarr, 'aiyongprovinceCode')}
                            >
                                {this.getOptions(aiyongarr, 'code').map((item: any) => {
                                    return <Option key={item.code} aiyongprovinceName={item.name}  data-item={item}>{item.code}-{item.name}</Option>;
                                })}
                            </AutoComplete> */}
                            {/* <Select
                                allowClear={true}
                                showSearch
                                style={{
                                    width: 200,
                                }}
                                value={inputValue.areaName}
                                onChange={this.changeSelectValue.bind(this, '', 'areaCode', inputValue.cityCode)}
                                fieldNames={{label: 'name', value: 'code'}}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.name ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.name ?? '').toLowerCase())
                                }
                                options={this.getOptions(aiyongarr, 'code', { type: inputValue.cityCode ? 'aiyongcityCode' : 'aiyongprovinceCode', value: inputValue.cityCode ? inputValue.cityCode : inputValue.provinceCode })}
                            /> */}
                            {/* <InputNumber
                                controls={false}
                                value={inputValue.bindId}
                                placeholder="请输入三级地址id"
                                style={{ width: 304 }}
                                onChange={this.changeInputValue.bind(this, 'bindId')}
                            /> */}
                        </div>
                        <div className='input-item'>
                            <span className='item-label'>爱用-省/市/区</span>
                            <Input
                                disabled
                                controls={false}
                                value={inputValue.aiyongHierarchy}
                                style={{ width: 304 }}
                            />
                        </div>
                    </div>
                }
            </Modal>
        </div>);
    }
}

export default AddressTool;
