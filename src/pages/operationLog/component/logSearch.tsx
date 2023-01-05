
import React from 'react';
import {
    DatePicker, Space, Select, Input, Button, ConfigProvider
} from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import 'moment/dist/locale/zh-cn';
import moment from 'moment';
import '../index.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;
interface IProps {
    /** 搜索关键词列表 */
    searchKeyList: any;
    onSearch: Function;
    /** 默认日期 */
    defaultMomentValue?: any;
    searchVal?: any;
    linkSearch?: boolean | any;
}
export const failTypeList = [
    {
        label: '支付失败',
        value: 'PAY_FAIL',
    },
    {
        label: '采购失败',
        value: 'CREATE_FAIL',
    },
];
const orderFailureType: any = [
    {
        value: 'all',
        label: '所有选项',
    },
    {
        value: '0',
        label: '转生产失败',
    },
    {
        value: '1',
        label: 'ERP发货失败',
    },
    {
        value: '2',
        label: '电商平台发货失败',
    },
    {
        value: '3',
        label: '确认收货失败',
    },
];
const operationType = [
    {
        value: '设置',
        label: '设置',
    },
    {
        value: '删除',
        label: '删除',
    },
];
//     0: '转生产失败',
//     1: 'ERP发货失败',
//     2: '电商平台发货失败'
// };
const storeIdType: any = {
    DOUDIAN: '抖音',
    XHS: '小红书',
    YOUZAN: '有赞',
    WXVIDEOSHOP: '视频号',
    KWAISHOP: '快手',
};

// 还要转换成给中台的数据 我真的会谢
export const storeId_params: any = {
    dy: 'DOUDIAN',
    yz: 'YOUZAN',
    ks: 'KWAISHOP',
    videoShop: 'WXVIDEOSHOP',
};
const associated = [
    {
        value: false,
        label: '未关联',
    },
    {
        value: true,
        label: '关联',
    },
];
/** 操作动作 */
const operationalMotion = [
    {
        value: '创建受理单',
        label: '创建受理单',
    },
    {
        value: '修改受理单',
        label: '修改受理单',
    },
    {
        value: '取消受理单',
        label: '取消受理单',
    },
    {
        value: '退货物流回寄',
        label: '退货物流回寄',
    },
];
/**
 * 电商平台名称
 * @param text
 * @returns
 */
export const shopTypeRender = (text: string | number, type: string = '') => {
    if (type === 'orderFailureType') {
        const orderFailure = orderFailureType.filter((item: any) => text == item.value);
        if (!orderFailure.length) {
            return <div>
                {text}
            </div>;
        }
        return <div>
            {orderFailure[0].label || text}
        </div>;
    } else if (type === 'storeId') {
        return <div>
            {storeIdType[text] || text}
        </div>;
    }
    const shopType = PLATFORM_OPTIONS.filter(item => text === item.value);
    if (!shopType.length) {
        return <div>
            {text}
        </div>;
    }
    return <div>
        {shopType[0].label || text}
    </div>;
};

interface IState  {
    /** 搜索数据 */
    searchData: any;
}
const PLATFORM_OPTIONS = [
    {
        value: 'all',
        label: '所有选项',
    },
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
const exceptionReason = [
    {
        value: '',
        label: '所有选项',
    },
    {
        value: '支付失败',
        label: '支付失败',
    },
    {
        value: '采购失败',
        label: '采购失败',
    },
];

/** 日志搜索组件 */
class LogSearch extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = { searchData: {} };
    }
    /**
     * 组建更新
     */
    componentDidUpdate (prevProps: Readonly<IProps>): void {
        const { linkSearch = false } = this.props;
        if (linkSearch && linkSearch !== prevProps.linkSearch) {
            this.setState({ searchData: this.props.searchVal });
        }
    }
    disabledDate = (current: any) => {
        return current && current > moment().endOf('day');
    }
    range = (start: any, end: any) => {
        const result = [];
        for (let index = start; index < end; index++) {
            result.push(index);
        }
        return result;
    }
    disabledDateTime = () => {
        const hour = moment().format('HH');
        const minutes = moment().format('mm');
        return {
            disabledHours: () => this.range(hour, 24),
            disabledMinutes: () => this.range(minutes, 60),
        };
    }
    /**
     * 改变input状态
     * @param val
     */
    changeInputVal = (type: string, event: any) => {
        const { searchData } = this.state;
        searchData[type] = event.target.value;
        this.setState({ searchData });
    }

    /**
     * 改变日期搜索框
     */
    changeDate = (type: string, dateString: any, val: string) => {
        const { searchData } = this.state;
        searchData[type] = val;
        searchData.momentTime = dateString;
        this.setState({ searchData });
    }

    /**
     * 改变电商平台
     * @param type
     * @param val
     */
    changePlatformName = (type: string, val: string) => {
        const { searchData } = this.state;
        searchData[type] = val;
        this.setState({ searchData });
    }

    /**
     * 点击搜索
     * type: 类型 search reset
     */
    onSearch = (type: string) => {
        const { onSearch } = this.props;
        const { searchData } = this.state;
        const searchValJson = JSON.stringify(searchData);
        let searchVal = JSON.parse(searchValJson);
        if (type === 'search') {
            // 处理一下时间不要传入
            if ('momentTime' in searchVal) {
                delete searchVal.momentTime;
            }
            // 处理下失败类型
            if (searchVal.orderFailureType && searchVal.orderFailureType === 'all') {
                delete searchVal.orderFailureType;
            }
            // 处理一下搜索平台的兼容
            if (searchVal.storeId) {
                searchVal.storeId = storeId_params[searchVal.storeId];
            }
            if (searchVal.sourceStoreId) {
                searchVal.sourceStoreId = storeId_params[searchVal.sourceStoreId];
            }
            // 过滤掉空的数据
            for (const key in searchVal) {
                if (searchVal[key] === '') {
                    delete searchVal[key];
                }
            }
        } else {
            // 重置
            this.setState({ searchData: {} });
            searchVal = {};
        }
        // 每次搜索 都在第一页
        searchVal.pageNo = 1;
        // 没有页码 给个默认值
        if (!searchVal.pageSize) {
            searchVal.pageSize = 50;
        }
        onSearch && onSearch(searchVal, type);
    }

    render (): React.ReactNode {
        const { searchKeyList, defaultMomentValue } = this.props;
        const { searchData } = this.state;
        return <div className="log-search">
            <div className='search-inputs'>
                {
                    searchKeyList.map((item: any) => {
                        if (item.status === 0) {
                            return null;
                        }
                        // 特殊处理一下 这个是要按月搜索
                        if (item.key === 'month') {
                            return <Space key={item.key}>
                                <div key={item.key} className='item-ipt'>
                                    <span className='title'>{item.title}</span>
                                    <ConfigProvider locale={zh_CN}>
                                        <DatePicker allowClear={false} disabledDate={this.disabledDate} value={searchData.momentTime || defaultMomentValue} onChange={this.changeDate.bind(this, item.key)} picker="month" />
                                    </ConfigProvider>
                                </div>
                            </Space>;
                        }
                        // 日期搜索
                        if (item.key.indexOf('Time') !== -1 || item.key === 'time') {
                            return <Space key={item.key}>
                                <div key={item.key} className='item-ipt'>
                                    <span className='title'>{item.title}</span>
                                    <ConfigProvider locale={zh_CN}>
                                        <RangePicker allowClear={false} disabledDate={this.disabledDate} showTime value={searchData.momentTime || defaultMomentValue}
                                            //  @ts-ignore
                                            onChange={this.changeDate.bind(this, item.key)} />
                                    </ConfigProvider>
                                </div>
                            </Space>;
                            // 平台搜索
                        } else if (item.key === 'shop_type' || item.key === 'storeId' || item.key === 'sourceStoreId' || item.key === 'platformName' || item.key === 'orderFailureType' || item.key === 'exceptionReason' || item.key === 'failType' || item.key === 'isAssociated' || item.key === 'operationalMotion' || item.key === 'operationType') {
                            // const PLATFORM_OPTIONS = item.key === 'shop_type' || item.key === 'storeId' || item.key === 'platformName';
                            // const orderFailure = item.key === 'orderFailureType';
                            let arr = [];
                            // let value = searchData[item.key];
                            if (item.key === 'shop_type' || item.key === 'storeId' || item.key === 'platformName' || item.key === 'sourceStoreId') {
                                arr = PLATFORM_OPTIONS;
                            } else if (item.key === 'orderFailureType') {
                                arr = orderFailureType;
                            } else if (item.key === 'exceptionReason') {
                                arr = exceptionReason;
                            } else if (item.key === 'failType') {
                                arr = failTypeList;
                            } else if (item.key === 'isAssociated') {
                                arr = associated;
                            } else if (item.key === 'operationalMotion') {
                                arr = operationalMotion;
                            } else if (item.key === 'operationType') {
                                arr = operationType;
                            }
                            return <div key={item.key} className='item-ipt' >
                                <span className='title' style={{ marginRight: '10px' }}>{item.title}</span>
                                <Select placeholder="请选择" value={searchData[item.key]} style={{ width: 146 }} onChange={this.changePlatformName.bind(this, item.key)}>
                                    {
                                        arr.map((item: any) => {
                                            return <Option
                                                key={item.value}
                                                value={item.value}
                                                label={item.label}
                                            >
                                                <div className='demo-option-label-item'>
                                                    {item.label}
                                                </div>
                                            </Option>;
                                        })
                                    }
                                </Select>
                            </div>;
                        }
                        return <div key={item.key} className='item-ipt' >
                            <span className='title'>{item.title}</span>
                            <Input placeholder="请输入" value={searchData[item.key]} onChange={this.changeInputVal.bind(this, item.key)}/>
                        </div>;
                    })
                }
            </div>
            <div className='search-btns'>
                <Button type="primary" className='operation-btn' onClick={this.onSearch.bind(this, 'search')}>搜索</Button>
                <Button type="primary" ghost  className='operation-btn' onClick={this.onSearch.bind(this, 'reset')}>重置</Button>
            </div>
        </div>;
    }
}

export default LogSearch;
