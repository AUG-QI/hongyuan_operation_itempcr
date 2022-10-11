import React, { ChangeEvent } from 'react';
import {
    Alert, Button, Input, InputNumber, message, Modal, Spin, Tree
} from 'antd';
import { delStockWarningInfo, getBasicStockValue, getCategoryOptions, updateStockWarningInfo } from '../commodityManagement/api';
import './index.scss';

/** 特殊预警标题数据 */
const SPECIAL_STOCK_TITLE_DATA: string[] = [
    '类目',
    '类目',
    '预警值',
    '上升阈值',
    '操作',
];
/** 数字正则 */
export const numberRegular = /^[0-9]*$/;

/** 提示语 */
const ALERT_MSG: string =
    '提示：1.sku库存小于预警值时，sku自动变成告罄状态   2.sku库存从预警值到预警值+上升阈值时，sku自动上架且同步最新库存   3.类目设置特殊库存同步后，以特殊库存同步为准';

interface IState {
    isModalOpen: boolean;
    checkSpecialStockDialogVisible: boolean;
    specialTypeSum: number;
    selectData: any;
    alertValue: string;
    upValue: string;
    checkedKeys: string[];
    treeData: any;
    inventoryCategoryData: any;
    /** 预警值 */
    prewarningValue: number | undefined;
    /** 上升阈值 */
    restoreValue: number | undefined;
    /** 将要删除名单 */
    willDeletedList: string[] | any;
    /** 数据加载 */
    spinning: boolean;
}
/** 检查input框回调 */
interface CheckInput {
    /** 返回信息 */
    message: string;
}
/** 库存同步页面 */
class InventorySynchronous extends React.Component<{}, IState> {
    constructor (props: {}) {
        super(props);
        this.state = {
            isModalOpen: false,
            checkSpecialStockDialogVisible: false,
            specialTypeSum: 0,
            selectData: [],
            alertValue: '',
            upValue: '',
            checkedKeys: [],
            treeData: [],
            prewarningValue: undefined,
            restoreValue: undefined,
            inventoryCategoryData: [],
            willDeletedList: [],
            spinning: true,
        };
    }
    async componentDidMount () {
        this.init();
        // 获取类目属性
        const treeData = await getCategoryOptions();
        this.setState({ treeData });
    }
    init = async () => {
        // 获取库存同步数据
        const data: any = await getBasicStockValue();
        if (!data.length) {
            return;
        }
        // 设置基础库存数据
        const { prewarningValue, restoreValue } = this.getBasicStockPreWarningInfo(data);
        // 展示特殊类目库存
        const inventoryCategoryData = data.filter((item: any) => item.cid != 0);
        this.setState({ inventoryCategoryData, prewarningValue, restoreValue, spinning: false });
    }
    /**
     * 获取基础类目信息
     */
    getBasicStockPreWarningInfo = (data: any) => {
        const basisInfo = data.find((item: any) => item.cid == 0);
        return {
            prewarningValue: basisInfo.prewarningValue,
            restoreValue: basisInfo.restoreValue,
        };
    }
    /**
     * 类目设置弹框
     */
    categorySettings = () => {
        this.setState({ isModalOpen: true });
    };
    /**
     * 确认
     */
    handleOk = async () => {
        const { selectData = [], alertValue, upValue } = this.state;
        if (!selectData.length || !alertValue.trim() || !upValue.trim()) return message.warning('请输入完整');
        if (!numberRegular.test(alertValue) || !numberRegular.test(upValue)) return message.warning('输入框需要纯数字');
        const res = await updateStockWarningInfo(selectData);
        if (res == 'success') {
            message.success('保存成功');
        } else {
            message.error('保存失败');
        }
        this.init();
        this.setState({ isModalOpen: false, selectData: [],  alertValue: '', upValue: '', checkedKeys: [] });
    };
    /**
     * 检查输入框内容
     * @param key
     */
    checkInputValue = (key: string[]): CheckInput => {
        key.forEach(item => {
            if (!item.length || !item.trim()) return { message: '请输入完整' };
            if (!numberRegular.test(item)) return { message: '输入框需要纯数字' };
        });
        return { message: 'success' };
    }
    /**
     * 取消
     */
    handleCancel = () => {
        const { selectData } = this.state;
        const checkedKeys = selectData.map((item: any) => item.cid);
        this.setState({ isModalOpen: false, selectData, checkedKeys });
    };

    /**
     * 改变input框
     * @param type
     * @param event
     */
    changeInputValue = (type: string, value: string) => {
        const { selectData } = this.state;
        const data: any = {
            alertValue: 'prewarningValue',
            upValue: 'restoreValue',
        };
        const inputValue = value;
        selectData.forEach((item: any) => {
            item[data[type]] = inputValue;
        });
        const updateInfo: any = {
            [type]: inputValue,
            inputValue,
        };
        this.setState(updateInfo);
    }
    /**
     * dialogFooterRender
     */
    dialogFooterRender = () => {
        const { alertValue, upValue } = this.state;
        return (
            <>
                <div className="set-warning-inputs">
                    <div className="setting-ipt">
                        <span> 预警值：</span>
                        <InputNumber controls={false} value={alertValue}
                            // @ts-ignore
                            onChange={this.changeInputValue.bind(this, 'alertValue')}></InputNumber>
                    </div>
                    <div className="setting-ipt">
                        <span> 上升阈值：</span>
                        <InputNumber controls={false} value={upValue}
                            // @ts-ignore
                            onChange={this.changeInputValue.bind(this, 'upValue')}></InputNumber>
                    </div>
                </div>
                <div>
                    <Button onClick={this.handleCancel}>取消</Button>
                    <Button onClick={this.handleOk} type="primary">
                        保存
                    </Button>
                </div>
            </>
        );
    };
    /**
     * 删除所有数据
     * @returns
     */
    delAllData = async () => {
        const { inventoryCategoryData } = this.state;
        const ids = inventoryCategoryData.map((item: any) => item.cid);

        this.setState({ inventoryCategoryData: [], willDeletedList: ids });
    }
    /**
     * 特殊库存检查弹框底部
     */
    checkSpecialStockDialogFooterRender = () => {
        return (
            <>
                <div className='all-empty' onClick={this.delAllData}>全部清空</div>
                <div>
                    <Button onClick={this.closeModifySpecialStock}>
                        取消
                    </Button>
                    <Button type="primary" onClick={this.submitModifySpecialStock}>
                        保存修改
                    </Button>
                </div>
            </>
        );
    };
    /**
     * 取消修改特殊库存同步
     */
    closeModifySpecialStock  = async () => {
        this.init();
        this.setState({ checkSpecialStockDialogVisible: false });
    }
    /**
     * 提交修改特殊类目
     * @returns
     */
    submitModifySpecialStock = async () => {
        const { willDeletedList } = this.state;
        let res = null;
        // 如果有删除的就去删掉
        if (willDeletedList.length) {
            res = await delStockWarningInfo(willDeletedList);
        }
        const { inventoryCategoryData } = this.state;
        // 有更新再去更新
        if (inventoryCategoryData.length) {
            res = await updateStockWarningInfo(inventoryCategoryData);
        }
        if (res == 'success') {
            message.success('保存成功');
        } else {
            message.error('保存失败');
        }
        this.setState({ checkSpecialStockDialogVisible: false, willDeletedList: [] });
    };
    /**
     * 关闭检查特殊类目弹框
     * @returns
     */
    clickCheckSpecialStockDialogVisible = (visible: boolean) => {
        this.setState({ checkSpecialStockDialogVisible: visible });
    };
    /**
     * 特殊库存检查内容
     */
    checkSpecialStockDialogBodyRender = () => {
        const { inventoryCategoryData } = this.state;
        if (!inventoryCategoryData.length) {
            return <div className="none-data">暂无数据</div>;
        }
        return (
            <div className="check-special-stock-dialog">
                <div className="special-stock-title stock-bg">
                    {SPECIAL_STOCK_TITLE_DATA.map((item) => {
                        return <span key={item}>{item}</span>;
                    })}
                </div>
                <div className="special-stock-info">
                    {this.checkTargetKeysRender()}
                </div>
            </div>
        );
    };
    /**
     * 改变input框
     * @param type
     * @param id
     * @param e
     */
    changeItemInput = (type: string, id: string | number, value: ChangeEvent<any>) => {
        const { inventoryCategoryData } = this.state;
        inventoryCategoryData.forEach((item: any) => {
            if (item.cid == id) {
                item[type] = value;
            }
        });
        this.setState({ inventoryCategoryData });
    }
    checkTargetKeysRender = () => {
        const { inventoryCategoryData } = this.state;
        return (
            <div>
                {inventoryCategoryData.map((item: any) => {
                    return (
                        <div key={item.cid} className="special-stock-title">
                            <span>{item.name}</span>
                            <span>
                                <InputNumber controls={false}
                                    // @ts-ignore
                                    onChange={this.changeItemInput.bind(this, 'prewarningValue', item.cid)} value={item.prewarningValue}></InputNumber>
                            </span>
                            <span>
                                <InputNumber controls={false}
                                    // @ts-ignore
                                    onChange={this.changeItemInput.bind(this, 'restoreValue', item.cid)}  value={item.restoreValue}></InputNumber>
                            </span>
                            <span
                                className='del-btn'
                                onClick={this.deltargetKeysItem.bind(
                                    this,
                                    item.cid
                                )}
                            >
                                删除
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };
    /**
     * 删除单个库存值
     * @param key
     */
    deltargetKeysItem = async (key: string) => {
        const { inventoryCategoryData, willDeletedList } = this.state;
        const newKeys = inventoryCategoryData.filter((item: any) => item.cid != key);
        willDeletedList.push(key);
        this.setState({ inventoryCategoryData: newKeys, willDeletedList });
    }
    /**
     * 选择类目
     * @param checkedKeys
     * @param e
     */
    onCheck = (checkedKeys: string[], event: any) => {
        const {  alertValue, upValue } = this.state;
        const selectData = this.getID(event.checkedNodes, alertValue, upValue);
        this.setState({ selectData, checkedKeys });
    }
    /**
     * 获取类目id
     * @param arr
     * @param alertValue
     * @param upValue
     * @returns
     */
    getID = (arr: any, alertValue: string | number, upValue: string | number) => {
        const data: any = [];
        arr.forEach((item: any) => {
            if (item.children) {
                this.getID(item.children, alertValue, upValue);
            } else {
                data.push({
                    name: item.categoryName,
                    cid: item.categoryId,
                    prewarningValue: alertValue,
                    restoreValue: upValue,
                });
            }
        });
        return data;
    }
    treeTransferRender = () => {
        const { selectData, checkedKeys, treeData } = this.state;
        return <div>
            <div className='select-harder'>
                <div>类目</div>
                <div>已选（{selectData.length}）</div>
            </div>
            <div className='select-content'>
                <div className='select-tree'>
                    <Tree
                        checkable
                        fieldNames={{
                            title: 'categoryName',
                            key: 'categoryId',
                        }}
                        // @ts-ignore
                        onCheck={this.onCheck}
                        treeData={treeData}
                        checkedKeys={checkedKeys}
                    />
                </div>
                <div className='select-items'>
                    {
                        selectData.map((item: any) =>  {
                            return <div key={item.cid}>
                                {item.name}
                            </div>;
                        })
                    }
                </div>
            </div>
        </div>;
    }
    /**
     * 保存设置
     * @returns
     */
    saveSte = async () => {
        // 1.检查基础库存同步
        const { prewarningValue, restoreValue } = this.state;
        const basicStock: any = [{
            id: 1,
            cid: 0,
            prewarningValue,
            restoreValue,
            name: '基础类目属性',
        }];
        const res = await updateStockWarningInfo(basicStock);
        if (res === 'success') {
            message.success('保存成功');
        } else {
            message.error('保存失败');
        }
        // 特殊类目保存
        this.setState({ checkSpecialStockDialogVisible: false, selectData: [], checkedKeys: [],  alertValue: '', upValue: '' });
    }
    /**
      * 修改基础预警值
      * @returns
    */
    changeBasicStockValue = (type: string, value: string) => {
        // const value: string = event.target.value;
        const updateInfo: any = { [type]: value };
        this.setState(updateInfo);
    }
    render () {
        const { isModalOpen, checkSpecialStockDialogVisible, prewarningValue, restoreValue, inventoryCategoryData, spinning } =
            this.state;
        return (
            <div className="inventory-synchronous">
                <Spin spinning={spinning}>
                    <Alert message={ALERT_MSG} />
                    <div className='basis-input'>
                        <h3>基础库存同步</h3>
                        <div>
                            <div className="basis-ipt">
                                <span>预警值：</span>
                                <InputNumber controls={false}
                                    // @ts-ignore
                                    value={prewarningValue}
                                    // @ts-ignore
                                    onChange={this.changeBasicStockValue.bind(this, 'prewarningValue')} placeholder="请输入预警值" />
                            </div>
                            <div className="basis-ipt">
                                <span>上升阈值：</span>
                                <InputNumber controls={false}
                                    // @ts-ignore
                                    value={restoreValue}
                                    // @ts-ignore
                                    onChange={this.changeBasicStockValue.bind(this, 'restoreValue')}  placeholder="请输入上升阈值" />
                            </div>
                        </div>
                    </div>
                    <div className="special-category">
                        <h3>特殊库存同步</h3>
                        <div className="info">
                            预警/上升阈值：
                            <span
                                className="operation-btn"
                                onClick={this.categorySettings}
                            >
                                请选择类目设置
                            </span>
                        </div>
                        {inventoryCategoryData.length > 0 ? (
                            <div>
                                已设置<span>{inventoryCategoryData.length}</span>
                                个类目特殊库存同步
                                <span
                                    className="operation-btn"
                                    onClick={this.clickCheckSpecialStockDialogVisible.bind(
                                        this,
                                        true
                                    )}
                                >
                                    查看详情
                                </span>
                            </div>
                        ) : null}
                    </div>
                    <Modal
                        open={isModalOpen}
                        footer={this.dialogFooterRender()}
                        closable={false}
                        width={800}
                    >
                        {this.treeTransferRender()}
                    </Modal>
                    <Modal
                        title="已设置特殊库存同步"
                        open={checkSpecialStockDialogVisible}
                        onCancel={this.closeModifySpecialStock.bind(
                            this,
                            false
                        )}
                        footer={this.checkSpecialStockDialogFooterRender()}
                        width={800}
                        className="check-special-stock-dialog"
                    >
                        {this.checkSpecialStockDialogBodyRender()}
                    </Modal>
                    <div className="save-btn">
                        <Button type="primary" onClick={this.saveSte}>保存设置</Button>
                    </div>
                </Spin>
            </div>
        );
    }
}

export default InventorySynchronous;
