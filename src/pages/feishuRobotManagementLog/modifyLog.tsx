import { message, Modal } from 'antd';
import React from 'react';
import { getSpecifiedTime, OPERATION_LOG_DATA } from '../operationLog';
import { EventEmitter } from 'events';
import { distributeOperate, feishuUpdateLog } from '../operationLog/api';
import LogPaging from '../operationLog/component/logPaging';
import LogSearch from '../operationLog/component/logSearch';
import LogTable from '../operationLog/component/logTable';

const eventEmiter = new EventEmitter();
interface IProps {}

interface IState {
    searchVal: any;
    defaultMomentValue: any;
    tableData: any;
    total: number;
    loading: boolean;
}
export const failTypeList = [
    {
        lable: 'PAY_FAIL',
        value: '支付失败',
        operation: '重新支付',
        type: 'PAY_ORIGIN',
    },
    {
        lable: 'CREATE_FAIL',
        value: '采购失败',
        operation: '重新采购',
        type: 'RE_ORIGIN',
    },
];
/**
 * 异常类型
 * @param text 
 * @returns 
 */
export const failTypeRender = (text: string, type: string, record = {}) => {
    const item = failTypeList.filter(item => item.lable === text);

    if (item.length) {
        if (type === 'operation') {
            return <a onClick={handleFailType.bind(this, item[0], record)}>{item[0].operation}</a>;
        }
        return <div>{item[0].value}</div>;
    }
    return <div>{text}</div>;
};
const eventHello = "hello";

/**
 * 挂在事件
 * @param handler
 */
function addListenerHello (handler: any) {
    eventEmiter.on(eventHello, handler);
}

/**
 * 触发事件
*/
function doHello (args: any) {
    eventEmiter.emit(eventHello, args);
}
/**
 * 处理异常类型
 * @param type 
 * @param record 
 * @returns 
 */
const handleFailType = async (type: any, record: any) => {
    doHello(true);
    const res: any = await distributeOperate({
        originId: record.originId,
        originPrimaryKey: record.orderPrimaryKey,
        operateType: type.type,
    });
    if (res !== 'success') {
        Modal.info({
            title: '温馨提示',
            content: (
                <div>
                    <p>{res}</p>
                </div>
            ),
        });
        doHello(false);
        return;
    }
    await doHello('refresh');
    return message.success(`${type.operation}成功`);
};
/** 采购单异常日志 */
class ModifyLog extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            searchVal: {},
            defaultMomentValue: [],
            tableData: [],
            total: 0,
            loading: true,
        };
    }
    componentDidMount (): void {
        const { searchVal } = this.state;
        const { momentTime, formateDate } = getSpecifiedTime('30');
        // 这里目前字段只能写死了
        this.setState({ searchVal: { ...searchVal, time: formateDate }, defaultMomentValue: momentTime }, () => {
            this.hanldeSearch();
        });
        addListenerHello(this.setLoadingTrue);
    }
    onSearch = (val: any, type: string) => {
        const searchVal = val;
        // 处理一下没有时间的情况
        if (type === 'reset' || !val.time) {
            const { formateDate } = getSpecifiedTime('30');
            searchVal.time = formateDate;
        }
        this.setState({ searchVal }, () => {
            this.hanldeSearch();
        });
    }
    /**
     * 改变每页条数
     * @param val
     */
    changePage = (val: any) => {
        const { searchVal } = this.state;
        const searchData = { ...searchVal, ...val };
        this.setState({ searchVal: searchData }, () => {
            this.hanldeSearch();
        });
    }
    setLoadingTrue = (val: any) => {
        eventEmiter.emit('true');
        if (val === 'refresh') {
            this.hanldeSearch();
            return;
        }
        this.setState({ loading: val });
    }
    hanldeSearch = async () => {
        eventEmiter.emit('true');
        this.setState({ loading: true });
        const { searchVal } = this.state;
        // 处理一下时间传入格式
        const searchDataJson = JSON.stringify(searchVal);
        const searchData = JSON.parse(searchDataJson);
        if (searchVal.time) {
            searchData.startTime = searchVal.time[0];
            searchData.endTime = searchVal.time[1];
            delete searchData.time;
        }
        const res: any = await feishuUpdateLog(searchData);
        this.setState({ tableData: res.operationLogConfigUpdateLogList, total: res.total, loading: false });
    }
    render (): React.ReactNode {
        const { defaultMomentValue, tableData, total, searchVal, loading  } = this.state;
        return <div className='feishu-robot-modify-log'>
            <LogSearch defaultMomentValue={defaultMomentValue} searchKeyList={OPERATION_LOG_DATA.FEISHU_ROBOT_MANAGEMENT_MODIFY_SEARCH_LIST} onSearch={this.onSearch}></LogSearch>
            <LogTable rowKey='id' loading={loading} tableData={tableData} tableTitle={OPERATION_LOG_DATA.FEISHU_ROBOT_MANAGEMENT_MODIFY_TABLE_ALL_LIST}></LogTable>
            <LogPaging total={total} changePage={this.changePage} pageNo={searchVal.pageNo || 1}></LogPaging>
            {/* <div className="log-paging" >
                <ConfigProvider locale={zh_CN}>
                    <Pagination showTotal={(total) => `共 ${total} 项 `} showSizeChanger={true} defaultPageSize={20} current={searchVal.pageNo || 1} total={total} onChange={this.changePage.bind(this)} pageSizeOptions={['20', '50', '80', '100']}/>
                </ConfigProvider>
            </div> */}
        </div>;
    }
}

export default ModifyLog;
