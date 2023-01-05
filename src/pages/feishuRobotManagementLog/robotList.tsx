import { Button, Input, message, Modal } from 'antd';
import React from 'react';
import {  OPERATION_LOG_DATA } from '../operationLog';
import { EventEmitter } from 'events';
import { editorRobotConfigurationList, getRobotConfigurationList } from '../operationLog/api';
import LogPaging from '../operationLog/component/logPaging';
import LogSearch from '../operationLog/component/logSearch';
import LogTable from '../operationLog/component/logTable';
import './index.scss';

const eventEmiter = new EventEmitter();
interface IProps {}

interface IState {
    searchVal: any;
    tableData: any;
    total: number;
    loading: boolean;
    storeStatus: boolean;
    editorDialogVisible: boolean;
    inputData: any;
    webhookStatus:  "" | "warning" | "error" ;
    feishuGroupNameStatus:  "" | "warning" | "error" ;
}
/** 操作飞书群 */
export const compileFeishuGroup = (item: any) => {
    return <a onClick={() => handleFeishuGroup(item)}>编辑</a>;
};
/** 处理飞书群编辑 */
const handleFeishuGroup = (item: any) => {
    doHello(item);
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
/** 飞书机器人管理操作 */
class RobotList extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        // @ts-ignore
        this.Child = React.createRef();
        this.state = {
            searchVal: {},
            tableData: [],
            total: 0,
            loading: true,
            storeStatus: false,
            editorDialogVisible: false,
            inputData: {
                webhook: '',
                feishuGroupName: '',

            },
            feishuGroupNameStatus: '',
            webhookStatus: '',
        };
    }
    componentDidMount (): void {
        this.hanldeSearch();
        addListenerHello(this.openEditorDialog);
    }
    onSearch = (val: any) => {
        const searchVal = val;
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

    openEditorDialog = (item: any) => {
        this.setState({ editorDialogVisible: true, inputData: item });
    }
    hanldeSearch = async () => {
        this.setState({ loading: true });
        const { searchVal, storeStatus } = this.state;
        // // 处理一下时间传入格式
        const searchDataJson = JSON.stringify(searchVal);
        const searchData = JSON.parse(searchDataJson);
        searchData.isDelete = !!storeStatus;
        const res: any = await getRobotConfigurationList(searchData);
        const tableData = res.operationLogConfigList?.map((item: any, index: number) => {
            return { ...item, index };
        }) || [];
        this.setState({ tableData, total: res.total, loading: false });
    }
    switchStoreGroup = () => {
        const { storeStatus } = this.state;
        // @ts-ignore
        this.Child.current.onSearch('reset');
        this.setState({ storeStatus: !storeStatus, searchVal: {} });
    }
    submitFormData = async () => {
        const userInfoJson = sessionStorage.getItem(`userInfo`) || '{}';
        const userinfo = JSON.parse(userInfoJson);
        const { inputData } = this.state;
        if (!inputData.webhook || !inputData.feishuGroupName) {
            if (!inputData.webhook) {
                this.setState({ webhookStatus: 'error' });
            }
            if (!inputData.feishuGroupName) {
                this.setState({ feishuGroupNameStatus: 'error' });
            }
            return;
        }

        const res: any = await editorRobotConfigurationList({
            ...inputData,
            // @ts-ignore
            operationIp: window.ip,
            feishuWebhook: inputData.webhook,
            operationAccount: userinfo.account,
            shopName: inputData.distributorShopName,
        });
        if (res === 'error') {
            message.error('保存失败');
            return;
        }
        message.success('保存成功');
        this.closeEditorDialog();
        this.hanldeSearch();
    }
    closeEditorDialog = () => {
        this.setState({ editorDialogVisible: false, feishuGroupNameStatus: '', webhookStatus: '' });
    }
    changeInputValue = (type: string, val: any) => {
        const { inputData } = this.state;
        const data = {
            ...inputData,
            [type]: val.target.value,
        };
        this.setState({ inputData: data });
    }
    render (): React.ReactNode {
        const { tableData, total, searchVal, loading, storeStatus, editorDialogVisible, inputData, feishuGroupNameStatus, webhookStatus  } = this.state;
        const storeBtnText = storeStatus ? '正常绑定店铺建群' : '解绑店铺建群记录';
        const searchKeyList = storeStatus ? OPERATION_LOG_DATA.FEISHU_ROBOT_MANAGEMENT_OPERATION_CHECK_SEARCH_LIST : OPERATION_LOG_DATA.FEISHU_ROBOT_MANAGEMENT_OPERATION_SEARCH_LIST;
        const tableTitle = storeStatus ?  OPERATION_LOG_DATA.FEISHU_ROBOT_MANAGEMENT_OPERATION_TABLE_CHECK_LIST : OPERATION_LOG_DATA.FEISHU_ROBOT_MANAGEMENT_OPERATION_TABLE_ALL_LIST;
        return <div className='feishu-robot-management-log'>
            <div className='switch-btn'><Button onClick={this.switchStoreGroup.bind(this)}>{storeBtnText} {'>>'}</Button></div>
            <LogSearch
            // @ts-ignore
                ref={this.Child} searchKeyList={searchKeyList} onSearch={this.onSearch}></LogSearch>
            <LogTable rowKey='index' loading={loading} tableData={tableData} tableTitle={tableTitle}></LogTable>
            <LogPaging total={total} changePage={this.changePage} pageNo={searchVal.pageNo || 1}></LogPaging>
            {/* <div className="log-paging" >
                <ConfigProvider locale={zh_CN}>
                    <Pagination showTotal={(total) => `共 ${total} 项 `} showSizeChanger={true} defaultPageSize={20} current={searchVal.pageNo || 1} total={total} onChange={this.changePage.bind(this)} pageSizeOptions={['20', '50', '80', '100']}/>
                </ConfigProvider>
            </div> */}
            <Modal title="编辑配置" open={editorDialogVisible} onOk={this.submitFormData} onCancel={this.closeEditorDialog}>
                <div className='input-item'>
                    <span>飞书群名</span>
                    <Input status={feishuGroupNameStatus} onChange={this.changeInputValue.bind(this, 'feishuGroupName')} value={inputData.feishuGroupName}></Input>
                    {feishuGroupNameStatus === 'error' && <span className='error-text'>请输入飞书群名</span>}
                </div>
                <div className='input-item'>
                    <span>webhook</span>
                    <Input status={webhookStatus} onChange={this.changeInputValue.bind(this, 'webhook')} value={inputData.webhook}></Input>
                    {webhookStatus === 'error' && <span className='error-text'>请输入webhook</span>}
                </div>
            </Modal>
        </div>;
    }
}

export default RobotList;
