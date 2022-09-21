import React from 'react';
import {
    Alert, Button, Input, message, Modal, Tree
} from 'antd';
import { getCategoryOptions } from '../commodityManagement/api';
import './index.scss';

const SPECIAL_STOCK_TITLE_DATA: string[] = [
    '类目',
    '预警值',
    '上升阈值',
    '操作',
];
export const numberRegular = /^[0-9]*$/;
const ALERT_MSG: string =
    '提示：1.sku库存小于预警值时，sku自动变成告罄状态   2.sku库存从预警值到预警值+上升阈值时，sku自动上架且同步最新库存   3.类目设置特殊库存同步后，以特殊库存同步为准';

/** 库存同步页面 */
class InventorySynchronous extends React.Component<{}, {}> {
    constructor (props: IProps) {
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
    handleOk = () => {
        const { selectData = [], alertValue, upValue } = this.state;
        if (!selectData.length || !alertValue.trim() || !upValue.trim()) return  message.info('请输入完整');
        if (!numberRegular.test(alertValue) || !numberRegular.test(upValue)) return message.info('输入框需要纯数字');
        this.setState({ isModalOpen: false });
        sessionStorage.setItem(`targetKeys`, JSON.stringify(selectData));
    };
    /**
     * 取消
     */
    handleCancel = () => {
        const selectData = JSON.parse(sessionStorage.getItem('targetKeys')) || [];
        const checkedKeys = selectData.map(item => item.id);
        this.setState({ isModalOpen: false, selectData, checkedKeys });
    };
    changeInputValue = (type, e) => {
        const { selectData } = this.state;
        selectData.forEach(item => {
            item.inputValue = {
                ...item.inputValue,
                [type]: e.target.value,
            };
        });
        this.setState({ [type]: e.target.value, selectData });
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
                        <Input value={alertValue} onChange={this.changeInputValue.bind(this, 'alertValue')}></Input>
                    </div>
                    <div className="setting-ipt">
                        <span> 上升阈值：</span>
                        <Input value={upValue} onChange={this.changeInputValue.bind(this, 'upValue')}></Input>
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
    delAllData = () => {
        sessionStorage.removeItem(`targetKeys`);
        this.setState({ selectData: [] });
    }
    /**
     * 特殊库存检查弹框底部
     */
    checkSpecialStockDialogFooterRender = () => {
        const { selectData } = this.state;
        if (!selectData.length) {
            return null;
        }
        return (
            <>
                <div onClick={this.delAllData}>全部清空</div>
                <div>
                    {' '}
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
    closeModifySpecialStock  = () => {
        const selectData = JSON.parse(sessionStorage.getItem('targetKeys')) || [];
        this.setState({ checkSpecialStockDialogVisible: false, selectData });
    }
    /**
     * 提交修改特殊类目
     * @returns
     */
    submitModifySpecialStock = () => {
        const { selectData } = this.state;
        const checkedKeys = selectData.map(item => item.id);
        sessionStorage.setItem(`targetKeys`, JSON.stringify(selectData));
        this.setState({ checkSpecialStockDialogVisible: false, checkedKeys });
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
        const data = JSON.parse(sessionStorage.getItem('targetKeys')) || [];
        if (!data.length) {
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
                    {this.checkTargetKeysRender(data)}
                </div>
            </div>
        );
    };
    changeItemInput = ( type, id, e) => {
        console.log(type, id,  e.target.value);
        const { selectData } = this.state;
        selectData.forEach(item => {
            if (item.id == id) {
                console.log(item, '????item');
                
                item.inputValue = {
                    ...item.inputValue,
                    [type]: e.target.value,
                }
            }
        })
        this.setState({selectData});

    }
    checkTargetKeysRender = () => {
        const { selectData } = this.state;
        // const selectData = JSON.parse(sessionStorage.getItem('targetKeys')) || [];
        return (
            <div>
                {selectData.map((item) => {
                    return (
                        <div key={item.id} className="special-stock-title">
                            <span>{item.name}</span>
                            <span>
                                <Input onChange={this.changeItemInput.bind(this, 'alertValue', item.id)} value={item.inputValue.alertValue}></Input>
                            </span>
                            <span>
                                <Input onChange={this.changeItemInput.bind(this, 'upValue', item.id)}  value={item.inputValue.upValue}></Input>
                            </span>
                            <span
                                onClick={this.deltargetKeysItem.bind(
                                    this,
                                    item.id
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
    deltargetKeysItem = (key) => {
        const { selectData } = this.state;
        const newKeys = selectData.filter((item) => item.id !== key);
        // const newCheckedKeys = newKeys.map(item => item.id);
        this.setState({ selectData: newKeys });
    };
    async componentDidMount () {
        const selectData = JSON.parse(sessionStorage.getItem('targetKeys')) || [];
        if (selectData.length) {
            const checkedKeys = selectData.map(item => item.id);
            this.setState({ selectData, checkedKeys });
        }
        // 获取类目属性
        const treeData = await getCategoryOptions();
        this.setState({ treeData });
    }

    onCheck = (checkedKeys, e) => {
        console.log(checkedKeys, 'checkedKeys');
        const {  alertValue, upValue } = this.state;
        const selectData = this.getID(e.checkedNodes, alertValue, upValue);
        this.setState({ selectData, checkedKeys });
    }
    
    getID = (arr, alertValue, upValue) => {
        const data = [];
        arr.forEach(item => {
            if (item.children) {
                this.getID(item.children);
            } else {
                data.push({
                    name: item.categoryName,
                    id: item.categoryId,
                    inputValue: {
                        alertValue,
                        upValue,
                    },
                });
            }
        });
        return data;
    }
    treeTransferRender = () => {
        const { selectData, checkedKeys } = this.state;
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
                        onCheck={this.onCheck}
                        treeData={selectData}
                        checkedKeys={checkedKeys}
                    />
                </div>
                <div className='select-items'>
                    {
                        selectData.map(item =>  {
                            return <div key={item.id}>
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
     saveSte = () => {
        sessionStorage.removeItem(`targetKeys`);
        this.setState({ checkSpecialStockDialogVisible: false, selectData: [], checkedKeys: [],  alertValue: '', upValue: '' });
     }
    render () {
        const selectData = JSON.parse(sessionStorage.getItem('targetKeys')) || [];
        const { isModalOpen, checkSpecialStockDialogVisible } =
            this.state;
        return (
            <div className="inventory-synchronous">
                <Alert message={ALERT_MSG} />
                <div>
                    <h3>基础库存同步</h3>
                    <div>
                        <div className="basis-ipt">
                            <span>预警值：</span>
                            <Input placeholder="请输入预警值" />
                        </div>
                        <div className="basis-ipt">
                            <span>上升阔值：</span>
                            <Input placeholder="请输入上升阔值" />
                        </div>
                    </div>
                </div>
                <div className="special-category">
                    <h3>特殊库存同步</h3>
                    <div className="info">
                        預警/上升岡值：
                        <span
                            className="operation-btn"
                            onClick={this.categorySettings}
                        >
                            请选择类目设置
                        </span>
                    </div>
                    {selectData.length > 0 ? (
                        <div>
                            已设置<span>{selectData.length}</span>
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
                <div className="save-btn">
                    <Button type="primary" onClick={this.saveSte}>保存设置</Button>
                </div>
                <Modal
                    title=""
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
                    onCancel={this.clickCheckSpecialStockDialogVisible.bind(
                        this,
                        false
                    )}
                    footer={this.checkSpecialStockDialogFooterRender()}
                    width={800}
                    className="check-special-stock-dialog"
                >
                    {this.checkSpecialStockDialogBodyRender()}
                </Modal>
            </div>
        );
    }
}

export default InventorySynchronous;
