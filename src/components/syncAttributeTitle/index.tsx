import { Button, message, Modal, Tree } from 'antd';
import axios from "../../../src/services/axios";
import React from 'react';
import {
    getPropsMapTaskProgress,
    pullPropsValuesMapData,
} from '../../../api/mulitemtransfromApi';
import { getID } from '../../pages/inventorySynchronous';
import './index.scss';

interface IProps {
    editorStatus: boolean;
    handleEditorAttribute: Function;
    treeData: any;
}

interface IState {
    /** 弹框显示 */
    dialogVisible: boolean;
    /** 选中的数据 */
    selectData: any;
    checkedKeys: any;
    syncing: boolean;
}

/**
 * 类目树组建
 */
export const treeTransferRender = (treeData: any, selectData: any, checkedKeys: any, onCheck = () => {}, defaultExpandAll = false) => {
    return (
        <div>
            <div className="select-harder">
                <div>类目</div>
                <div>已选（{selectData.length}）</div>
            </div>
            <div className="select-content">
                <div className="select-tree">
                    <Tree
                        checkable
                        fieldNames={{
                            title: 'categoryName',
                            key: 'categoryId',
                        }}
                        defaultExpandAll={defaultExpandAll}
                        // @ts-ignore
                        onCheck={onCheck}
                        treeData={treeData}
                        checkedKeys={checkedKeys}
                    />
                </div>
                <div className="select-items">
                    {selectData.map((item: any) => {
                        return <div key={item.cid}>{item.name}</div>;
                    })}
                </div>
            </div>
        </div>
    );
};
/** 同步属性头部 */
class SyncAttributeTitle extends React.Component<IProps, any> {
    constructor (props: IProps) {
        super(props);
        this.state = {
            dialogVisible: false,
            selectData: [],
            checkedKeys: [],
            alertValue: '',
            upValue: '',
            completeNum: 0,
            total: 0,
            syncing: true, // 同步状态
        };
    }
    /**
     * 点击同步数据按钮
     */
    clickSyncDataBtn = () => {
        const { syncing } = this.state;
        if (syncing) {
            return message.warning('正在同步数据，请勿重复点击');
        }
        this.setState({ dialogVisible: true });
    };
    /**
     * 处理同步数据
     */
    handleSyncData = async () => {
        const { selectData } = this.state;
        if (!selectData.length) {
            return message.warning('请先选择类目');
        }
        const cisList = selectData.map((item: any) => item.cid);
        const cids = cisList.join(',');
        message.success('同步任务已提交，请耐心等待');
        this.setState({ dialogVisible: false });
        pullPropsValuesMapData({ cids });
        // 开始定时搜索
        setTimeout(() => {
            this.getPropsMapTaskProgress();
        }, 1000);
    };
    closeDialog = () => {
        this.setState({ dialogVisible: false, selectData: [], checkedKeys: [] });
    };
    onCheck = (checkedKeys: string[], event: any) => {
        const { alertValue, upValue } = this.state;
        const selectData = getID(event.checkedNodes, alertValue, upValue);
        this.setState({ selectData, checkedKeys });
    };

    footerRender = () => {
        return (
            <div className='footer-render async-data-footer'>
                <Button onClick={this.closeDialog.bind(this)}>取消</Button>
                <Button type="primary" onClick={this.handleSyncData}>
                    同步数据
                </Button>
            </div>
        );
    };
    getPropsMapTaskProgress = async () => {
        axios.post('itemManage/getPropsMapTaskProgress', {})
            .then((response: any) => {
                if (response.code !== 200) {
                    message.error('同步任务失败');
                }
                // 没有同步任务
                if (!response.data || !response.data?.progress) {
                    this.setState({ total: 0, completeNum: 0, syncing: false });
                    return;
                }
                const res = response.data;
                // 执行总数
                const total = res?.cid_list.split(',').length;
                // 完成数量
                const completeNum = parseInt(
                    // @ts-ignore
                    (total * Number.parseFloat(res.progress)) / 100
                )
                this.setState({ total, completeNum }, () => {
                    setTimeout(() => {
                        this.getPropsMapTaskProgress();
                    }, 3000);
                });

            })
            .catch((error: any) => {
                message.error('同步任务失败');
            });
            // const { syncing } = this.state;
        // console.log('???????没有进来吗？？？？？',syncing);
        
        // while (syncing) {
            // const res = await getPropsMapTaskProgress();
        //     console.log(syncing, res, '???res');
            
        //     if (res === 'none') {
        //         this.setState({ total: 0, completeNum: 0, syncing: false });
        //         break;
        //     }
        //     // 执行总数
        //     const total = res.cid_list.split(',').length;
        //     // 完成数量
        //     const completeNum = parseInt(
        //         // @ts-ignore
        //         (total * Number.parseFloat(res.progress)) / 100
        //     );
        //     this.setState({ total, completeNum });
        // }
        // const res = await getPropsMapTaskProgress();
        // 没有同步任务
        // if (res === 'none') {
        //     this.setState({ total: 0, completeNum: 0, syncing: true });
        //     return;
        // }
        // 有正在执行的任务
        // 执行总数
        // const total = res.cid_list.split(',').length;
        // // 完成数量
        // const completeNum = parseInt(
        //     // @ts-ignore
        //     (total * Number.parseFloat(res.progress)) / 100
        // );
        // this.setState({ total, completeNum, syncing: false });
    };
    componentDidMount () {
        this.getPropsMapTaskProgress();
        /*  */
    }
    render(): React.ReactNode {
        const { handleEditorAttribute = () => {}, editorStatus, treeData } = this.props;
        const { dialogVisible, completeNum, total, selectData, checkedKeys } = this.state;
        const statusText = editorStatus ? '保存设置' : '编辑';
        return (
            <div className="log-search sync-attribute-title">
                <div className="steps-box">
                    <span className="steps">1</span>
                    <span className="steps-text">步骤一</span>
                    <Button type="primary" onClick={this.clickSyncDataBtn}>
                        同步数据
                    </Button>
                    <span className="synchronous">
                        同步进度({completeNum}/{total})
                    </span>
                </div>
                <div className="steps-box">
                    <span className="steps">2</span>
                    <span className="steps-text">步骤二</span>
                    <Button
                        type="primary"
                        onClick={() => {
                            if (editorStatus) {
                                sessionStorage.setItem('editorStatus', '0');
                            } else {
                                sessionStorage.setItem('editorStatus', '1');
                            }
                            handleEditorAttribute(
                                !editorStatus,
                                statusText
                            );
                        }}
                    >
                        {statusText}
                    </Button>
                </div>
                <Modal
                    title="同步数据"
                    open={dialogVisible}
                    footer={this.footerRender()}
                    onCancel={this.closeDialog}
                >
                    {
                        // @ts-ignore
                        treeTransferRender(treeData, selectData, checkedKeys, this.onCheck)}
                </Modal>
            </div>
        );
    }
}

export default SyncAttributeTitle;
