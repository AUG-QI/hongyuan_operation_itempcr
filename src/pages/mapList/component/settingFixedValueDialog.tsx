
import React from 'react';
import { Button, Input, message, Modal } from 'antd';
import { setPropsDefaultValue } from '../../../../api/mapToolApi';
import { PLATFORM_IMG } from '../../../components/selectPlatform';
import { isEmpty } from '../../../services/utils';

interface SettingFixedValueDialogProps {
    /** 处理关闭弹框 */
    closeSettingFixedValueDialog: () => void;
    settingFixedValueList: any;
}

interface SettingFixedValueDialogState {
    /** 弹框状态类型 */
    dialogStatusType: string;
    /** 抖音值 */
    dyValue: string;
    ksValue: string;
    shipinghaoValue: string;
    /** 爱用值 */
    ayValue: string;
}

/** 设置固定值弹框 */
class SettingFixedValueDialog extends React.Component<SettingFixedValueDialogProps, SettingFixedValueDialogState> {
    constructor (props: SettingFixedValueDialogProps) {
        super(props);
        this.state = {
            dialogStatusType: 'setPlatform',
            dyValue: '',
            ksValue: '',
            shipinghaoValue: '',
            ayValue: '',
        };
    }
    handleBirthRecommendDomainDialogCallback = () => {

    }
    setDownstreamPlatform = (type : string) => {
        this.setState({ dialogStatusType: type });
    }
    changeInputValue = (type: string, event: any) => {
        const value = event.target.value;
        //  @ts-ignore
        this.setState({ [type]: value });
    }
    submitData = async (pname: string) => {
        const { settingFixedValueList, closeSettingFixedValueDialog } = this.props;
        const { ayValue, dialogStatusType,  dyValue, ksValue, shipinghaoValue } = this.state;
        if (dialogStatusType === 'setPlatform' && isEmpty(ayValue)) {
            return message.warning('请先输入默认值');
        } else if ((isEmpty(dyValue) && isEmpty(ksValue) && isEmpty(shipinghaoValue)) && dialogStatusType === 'setDownstreamPlatform') {
            return message.warning('请先输入默认值');
        }
        const idsList = settingFixedValueList.map((item: any) => item.ay_cid);
        const aycids = idsList.join(',');
        const data: any = {
            aycids,
            pname,
        };
        if (dialogStatusType === 'setPlatform') {
            data.vname = ayValue;
        } else {
            const setDownstreamPlatform: any = {};
            if (!isEmpty(ksValue)) {
                setDownstreamPlatform.KWAISHOP = ksValue;
            }
            if (!isEmpty(dyValue)) {
                setDownstreamPlatform.DOUDIAN = dyValue;
            }
            if (!isEmpty(shipinghaoValue)) {
                setDownstreamPlatform.WXVIDEOSHOP = shipinghaoValue;
            }
            data.vnames = JSON.stringify(setDownstreamPlatform);
        }
        const res = await setPropsDefaultValue(data);
        if (isEmpty(res.success)) {
            return message.error(`操作失败${res.fail.length}笔`);
        }
        if (isEmpty(res.fail)) {
            message.success(`操作成功${res.success.length}笔`);
        } else {
            message.warning(`操作成功${res.fail.length}笔，操作失败${res.success.length}笔`);
        }
        closeSettingFixedValueDialog?.();
    }
    render () {
        const { closeSettingFixedValueDialog, settingFixedValueList } = this.props;
        const { dialogStatusType, ksValue, dyValue, shipinghaoValue, ayValue } = this.state;
        const ayAttributeName = settingFixedValueList.map((trade: any) => trade.ay_prop_name)[0] || '';
        return (<Modal title="设置固定值" className='setting-fixedValue-dialog' footer={null} open={true}  onCancel={closeSettingFixedValueDialog.bind(this)} onOk={this.submitData.bind(this, ayAttributeName)}>
            <div>
                <span style={{ marginRight: '20px' }}>爱用属性： {ayAttributeName}</span>
                { dialogStatusType === 'setPlatform' ? <span className='remark'>(若无爱用公共值域，请<span className='setting-text' onClick={this.setDownstreamPlatform.bind(this, 'setDownstreamPlatform')}>设置下游平台固定值</span>)</span> : <span className='setting-text' style={{float: 'right'}} onClick={this.setDownstreamPlatform.bind(this, 'setPlatform')}>返回</span>}
                <div className='setting-input'>
                    {
                        dialogStatusType === 'setPlatform' ? <Input value={ayValue} placeholder='请输入固定值' onChange={this.changeInputValue.bind(this, 'ayValue')}/>
                            : <div>
                                <div className='platform-info'><img  className='platform-img' src={PLATFORM_IMG.doudian} alt="" /> <Input value={dyValue} onChange={this.changeInputValue.bind(this, 'dyValue')} placeholder='设置固定值'></Input></div>
                                <div className='platform-info' ><img  className='platform-img'src={PLATFORM_IMG.kuai} alt="" /> <Input value={ksValue} onChange={this.changeInputValue.bind(this, 'ksValue')} placeholder='设置固定值'></Input></div>
                                <div className='platform-info'><img  className='platform-img'src={PLATFORM_IMG.shipinhao} alt="" /> <Input value={shipinghaoValue} onChange={this.changeInputValue.bind(this, 'shipinghaoValue')} placeholder='设置固定值'></Input></div>
                            </div>
                    }
                </div>
                <div className='setting-footer'>
                    <Button className='cancel-btn' onClick={closeSettingFixedValueDialog.bind(this)}>取消</Button>
                    <Button className='footer-btn' type="primary" onClick={this.submitData.bind(this, ayAttributeName)}>确定</Button>
                </div>
            </div>
        </Modal>);
    }
}

export default SettingFixedValueDialog;
