import React from 'react';
import { Button, Checkbox, Modal, Pagination, Upload } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';
import moment from '_moment@2.29.4@moment';
import './index.scss';

const { Dragger } = Upload;
interface IProps {
    /** 处理全选按钮 */
    handelSelectAll: Function;
    /** 改变页码 */
    changePageSize: Function;
    /** 处理操作按钮 */
    handelOperationBtn: Function;
    /**  是否全选 */
    isAllValue: boolean;
    /** 来自 */
    from: string;
    /** 总数 */
    total: number;
}
interface IState {
    /** 每页条数 */
    pageSize: number;
    /** 导出选项可见 */
    exportOptionsVisble: boolean;
    /** 上传文件弹框 */
    uploadFileDialogVisible: boolean;
    /** 当前页 */
    current: number;
}
const propsData = {
    name: 'file',
    multiple: true,
};
class FooterPage extends React.Component<IProps, IState>  {
    constructor (props: IProps) {
        super(props);
        this.state = {
            pageSize: 20,
            exportOptionsVisble: false,
            uploadFileDialogVisible: false,
            current: 1,
        };
    }
    componentDidMount (): void {
        document.addEventListener('click', this.clickExportOption.bind(this, false));
    }

    /**
     * 点击全选
     * @returns
     */
    handelSelectAll = (e) => {
        const { handelSelectAll } = this.props;
        const isAllValue = e.target.checked;
        handelSelectAll(isAllValue);
    }

    /**
     * 改变页码
     * @returns
     */
    changePageSize = (val: number) => {
        console.log(val, '/?????val');
        this.setState({ current: val });
        const { changePageSize } = this.props;
        changePageSize(val);
    }

    /**
     * 导出商品
     * @returns
     */
    exportItems = () => {
        console.log('导出商品');
    }
    /**
     * 导入商品
     * @returns 
     */
    importItems = () => {
        console.log('导入商品');
    }
    /**
     * 处理导出商品
     * @returns 
     */
    handelExportItems = (type: string) => {
        console.log(type, '??????');
        if (type === 'all') {
            // 全部商品
        } else if (type === 'selected') {
            // 选中的
            // const {} = this.state;
        }
    }
    /**
     * 关闭选择框
     * @returns 
     */
    clickExportOption = (val: boolean) => {
        this.setState({ exportOptionsVisble: val });
    }
    /**
     * handelImportItems
     * @returns 
     */
    handelImportItems = () => {
        console.log('handelImportItems');
    }
    /**
     * closeUploadInfoDialog
     * @returns 
     */
    closeUploadInfoDialog = () => {
        this.setState({ uploadFileDialogVisible: false });
    }
    /**
     * 上传文件
     * @returns 
     */
    updateFile = (val) => {
        const files = val.fileList[0];
        const userArr = [];   // 用户名结果数组
        if (files) {
            this.closeUploadInfoDialog();
        }
        if (files.size == 0) {
            // 文件空的
            return;
        }
        const reader = new FileReader();
        reader.readAsText(files, 'gb2312');
        console.log(reader);
        reader.onload = function (e) {
            const tempstr = this.result;
            // 去除空对象组装新数组
            // 区分类型
            const tempArr = (
                tempstr.split('\n')
            );
            // FIXME txt格式换行符会判断不为空
            tempArr.forEach((item, index) => {
                if (item != '' && item != undefined) {
                    userArr.push(item);
                }
            });
            // 拼装数据
            const addData = {
                buyerNicks: userArr,
                reason: '批量上传',
            };
            console.log(addData, '????');
            // 添加黑名单
            // self.props.actions.batchImportBlackList(addData, blType);
            // self.batchImportDialogHide();
        };
    }
    render () {
        const { from, isAllValue, handelOperationBtn, total } = this.props;
        const { pageSize, exportOptionsVisble, uploadFileDialogVisible, current } = this.state;
        return (
            <div className="footer-page">
                <div className="operation-btns">
                    <Checkbox
                        className="export-btn"
                        checked={isAllValue === true}
                        onChange={this.handelSelectAll}
                    >
                        全选本页
                    </Checkbox>
                    {from === 'productList' && (
                        <>
                            <Button
                                type="primary"
                                className="export-btn"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    this.clickExportOption(true);
                                }}
                            >
                                导出商品
                            </Button>
                            <Button type="primary" onClick={() => {
                                this.handelImportItems();
                                handelOperationBtn('importItems');
                            }} className="export-btn">
                                导入商品
                            </Button>
                        </>
                    )}
                    {from === 'distributors' && (
                        <div>
                            <Button type="primary" ghost onClick={() => handelOperationBtn('takenDown')}>批量下架</Button>
                        </div>
                    )}
                    {
                        exportOptionsVisble && <div className='export-options'>
                            <div className='options-item' onClick={this.handelExportItems.bind(this, 'selected')}>选择商品</div>
                            <div className='options-item' onClick={this.handelExportItems.bind(this, 'all')}>全部商品</div>
                        </div>
                    }
                </div>
                <Pagination
                    total={total}
                    pageSize={pageSize}
                    onChange={this.changePageSize}
                    showSizeChanger={false}
                    current={current}
                />
                <Modal title="导入商品信息" open={uploadFileDialogVisible} onCancel={this.closeUploadInfoDialog} footer={null} className='upload-info-dialog'>
                    <Dragger {...propsData} onChange={this.updateFile}>
                        <p className="ant-upload-drag-icon">
                            <ContainerOutlined />
                        </p>
                        <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                        <p className="ant-upload-hint">
                            支持格式：.xls、.xlsx
                        </p>
                    </Dragger>
                </Modal>
            </div>
        );
    }
    componentWillUnmount () {
        // document.removeEventListener('click', this.clickExportOption, false);
    }
}
export default FooterPage;
