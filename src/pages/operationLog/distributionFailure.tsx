import React from 'react';
import { EventEmitter } from 'events';
import LogSearch from "./component/logSearch";
import LogTable from "./component/logTable";
import LogPaging from "./component/logPaging";
import { getSpecifiedTime, OPERATION_LOG_DATA } from './index';
import { getDistributeErrorLog } from './api';
import './index.scss';

const eventEmiter = new EventEmitter();
interface IProps {}

interface IState {
    searchVal: any;
    tableTitle: any;
    total: number;
    tableData: any;
    defaultMomentValue: any;
    loading: boolean;
    linkSearch: boolean;
}
const eventHello = "hello";

/**
 * 挂在事件
 * @param handler
 */
export function addListenerHello (handler: any) {
    eventEmiter.on(eventHello, handler);
}

/**
 * 触发事件
*/
export function doHello (args: any) {
    eventEmiter.emit(eventHello, args);
}
/** 铺货失败日志 */
class DistributionFailure extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            searchVal: {},
            tableTitle: OPERATION_LOG_DATA.SHELVES_FAILURE_TABLE_DEFAULT_LIST,
            total: 0,
            tableData: [],
            defaultMomentValue: null,
            loading: true,
            linkSearch: false,
        };
    }
    componentDidMount (): void {
        const { searchVal } = this.state;
        const { momentTime, formateDate  } = getSpecifiedTime('month');
        // 这里目前字段只能写死了
        this.setState({ searchVal: { ...searchVal, month: formateDate }, defaultMomentValue: momentTime }, () => {
            this.hanldeSearch();
        });
        addListenerHello(this.hanldeSearch);
    }
    /**
     * 点击搜索
     */
    onSearch = (val: any, type: string) => {
        eventEmiter.emit(val, type);
        const searchVal = val;
        const updataInfo = { searchVal };
        // 处理一下没有时间的情况
        if (type === 'reset' || !val.month) {
            const { formateDate } = getSpecifiedTime('month');
            searchVal.month = formateDate;
        }
        this.setState(updataInfo, () => {
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

    /**
     * 真正开始搜索
     */
    hanldeSearch = async (searchInfo = null) => {
        const { searchVal } =  this.state;
        const parameter = searchInfo || searchVal;
        // 处理一下搜索参数里面的页码
        const searchDataJson = JSON.stringify(parameter);
        const searchData = JSON.parse(searchDataJson);
        if (parameter.pageNo) {
            searchData.page_no = parameter.pageNo;
            delete searchData.pageNo;
        }
        if (parameter.pageSize) {
            searchData.page_size = parameter.pageSize;
            delete searchData.pageSize;
        }
        const res: any = await getDistributeErrorLog(searchData);
        const updateData: any = {
            tableData: res.logs,
            total: res.total_amount,
            loading: false,
        };
        // 处理一下变化表格数据的逻辑
        if (parameter.shop_type ||
            parameter.seller_id ||
            parameter.shop_name ||
            parameter.origin_num_iid ||
            parameter.origin_title ||
            parameter.distribute_memo) {
            updateData.tableTitle = OPERATION_LOG_DATA.SHELVES_FAILURE_TABLE_ALL_LIST;
        } else {
            updateData.tableTitle = OPERATION_LOG_DATA.SHELVES_FAILURE_TABLE_DEFAULT_LIST;
        }
        if (searchInfo) {
            updateData.searchVal = searchInfo;
            updateData.linkSearch = true;
        } else {
            updateData.linkSearch = false;
        }
        this.setState(updateData);
    }
    render (): React.ReactNode {
        const { tableTitle, searchVal, total, tableData, defaultMomentValue, loading, linkSearch } = this.state;
        return <div className="distribution-failure">
            <LogSearch searchVal={searchVal} linkSearch={linkSearch} defaultMomentValue={defaultMomentValue} searchKeyList={OPERATION_LOG_DATA.SHELVES_FAILURE_SEARCH_LIST} onSearch={this.onSearch}></LogSearch>
            {/* <Spin spinning={true}> */}
            <LogTable loading={loading} rowKey='id' tableData={tableData} tableTitle={tableTitle}></LogTable>
            <LogPaging total={total} changePage={this.changePage} pageNo={searchVal.pageNo || 1}></LogPaging>
            {/* </Spin> */}
        </div>;
    }
}

export default DistributionFailure;
