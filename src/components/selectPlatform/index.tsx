import React from 'react';
import { Select } from 'antd';
import './index.scss';

const { Option } = Select;

/** 平台图片 */
export const PLATFORM_IMG: any = {
    all: 'https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/all_platform_icon.png',
    doudian:
        'https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/douyin_logo.png',
    doudianGray: 'https://q.aiyongtech.com/biyao/imgs/douyin_logo_%20grey.png',
    kwaishop:
        'https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/kuaishou_logo.png',
    kuai: 'https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/kuaishou_logo.png',
    kuaiGray: 'https://q.aiyongtech.com/biyao/imgs/kuaishou_logo_%20grey.png',
    hong: 'https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/xiaohongshu_logo.png',
    hongGray:
        'https://q.aiyongtech.com/biyao/imgs/xiaohongshu_logo_%20grey.png',
    youzan: 'https://q.aiyongtech.com/biyao/imgs/youzan_logo.png',
    youzanGray: 'https://q.aiyongtech.com/biyao/imgs/youzan_logo_%20grey.png',
    shipinhao: 'https://q.aiyongtech.com/biyao/imgs/shipinghao_logo.png',
    wxvideoshop: 'https://q.aiyongtech.com/biyao/imgs/shipinghao_logo.png',
    shipinhaoGray:
        'https://q.aiyongtech.com/biyao/imgs/shipinghao_logo_grey.png',
};
export const IMG_NAME: any = {
    dy: 'doudian',
    yz: 'youzan',
    ks: 'kuai',
    videoShop: 'shipinhao',
};
/**
 * 下拉选择项
 */
export const PLATFORM_OPTIONS = [
    {
        value: 'all',
        label: '所有平台',
    },
    {
        value: 'doudian',
        label: '抖音',
    },
    {
        value: 'youzan',
        label: '有赞',
    },
    {
        value: 'kuai',
        label: '快手',
    },
    {
        value: 'shipinhao',
        label: '视频号',
    },
];
/**
 * 下拉选择项
 */
// export const PLATFORM_OPTIONS_LIGHT = [
//     {
//         value: 'dy',
//         label: '抖音',
//     },
//     {
//         value: 'yz',
//         label: '有赞',
//     },
//     {
//         value: 'ks',
//         label: '快手',
//     },
//     {
//         value: 'videoShop',
//         label: '视频号',
//     },
// ];
interface IProps {
    /** 处理选择器改变 */
    handleSelectChange: Function;
    /** 来自 */
    from?: string;
    /** 搜索平台 */
    distributionState: any;
}

interface IState {
    /** 选择方式 */
    selectMode: 'multiple' | 'tags' | any;
    optionLight: any;
    optionNoLight: any;
}

/** 平台选择器 */
class SelectPlatform extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            selectMode: 'multiple',
            optionLight: [
                {
                    value: 'doudian',
                    label: '抖音',
                    disabled: false,
                },
                {
                    value: 'youzan',
                    label: '有赞',
                    disabled: false,
                },
                {
                    value: 'kuai',
                    label: '快手',
                    disabled: false,
                },
                {
                    value: 'shipinhao',
                    label: '视频号',
                    disabled: false,
                },
            ],
            optionNoLight: [
                {
                    value: 'doudianGray',
                    label: '抖音',
                    disabled: false,
                },
                {
                    value: 'youzanGray',
                    label: '有赞',
                    disabled: false,
                },
                {
                    value: 'kuaiGray',
                    label: '快手',
                    disabled: false,
                },
                {
                    value: 'shipinhaoGray',
                    label: '视频号',
                    disabled: false,
                },
            ],
        };
    }
    componentDidMount (): void {
        const { from = '' } = this.props;
        if (from === 'distributors') {
            this.setState({ selectMode: 'mode' });
        }
    }
    /**
     * 改变选择器框内容
     */
    onChange = (val: string[]) => {
        const { handleSelectChange, from, distributionState } = this.props;
        if (from === 'distributors') {
            handleSelectChange(val);
            return;
        }
        const { optionLight, optionNoLight } = this.state;
        let newSelectValues = val || distributionState;
        // 如果数据含了亮灯就禁用掉
        // const noLight = PLATFORM_OPTIONS.map(item => item.value);
        // const newVal = this._resultSameValue2(noLight, val);
        // console.log(newVal, '??/noLight');

        // if (noLight.includes)
        if (distributionState.includes('all') && val.length) {
            newSelectValues = val.filter((item) => item !== 'all');
        } else if (val.includes('all') || !val.length) {
            // 如果是后来选中全部，就清空之前的
            newSelectValues = ['all'];
            const newLight = optionLight.map((item: any)  => {
                return { ...item, disabled: false };
            });
            const newOpt = optionNoLight.map((item: any)  => {
                return { ...item, disabled: false };
            });
            this.setState({ optionLight: newLight, optionNoLight: newOpt });
        }
        // 若果有不亮灯的
        if (newSelectValues[newSelectValues.length - 1].includes('Gray')) {
            // 去除之前亮灯的
            // newSelectValues = newSelectValues.filter(item => !item.includes('Gray'));
            const newLight = optionLight.map((item: any) => {
                return { ...item, disabled: true };
            });
            this.setState({ optionLight: newLight });
        } else if (newSelectValues[newSelectValues.length - 1] !== 'all') {
            // 若果有不亮灯的
            // 去除之前亮灯的
            // newSelectValues = newSelectValues.filter(item => !item.includes('Gray'));
            const newOpt = optionNoLight.map((item: any)  => {
                return { ...item, disabled: true };
            });
            this.setState({ optionNoLight: newOpt });
        }
        // // 如果之前数据里面有选择全部，又选择其他的了，就删掉全部选项
        // if (distributionState.includes('all') && val.length) {
        //     newSelectValues = val.filter(item => item !== 'all');
        // } else if (val.includes('all') || !val.length) {
        //     // 如果是后来选中全部，就清空之前的
        //     newSelectValues = ['all'];
        // }
        handleSelectChange(newSelectValues);
    };

    render() {
        const { from, distributionState } = this.props;
        const { optionLight, optionNoLight } = this.state;
        return (
            <Select
                mode={'multiple'}
                value={distributionState}
                onChange={this.onChange}
                maxTagCount="responsive"
                style={{ width: 400 }}
                showArrow={true}
                notFoundContent="暂无搜索内容"
            >
                <Option value={'all'} label={'所有平台'}>
                    <div className="demo-option-label-item">
                        <span
                            role="img"
                            aria-label="China"
                            className="option-items-img"
                        >
                            <img src={PLATFORM_IMG.all} alt="" />
                        </span>
                        所有平台
                    </div>
                </Option>
                {optionNoLight.map((item: any) => {
                    return (
                        <Option
                            key={item.value}
                            value={item.value}
                            label={item.label}
                            disabled={item.disabled}
                        >
                            <div className="demo-option-label-item">
                                <span
                                    role="img"
                                    aria-label="China"
                                    className="option-items-img"
                                >
                                    <img src={ PLATFORM_IMG[item.value]} alt="" />
                                </span>
                                {item.label}
                                {item.value === 'all' || from === 'distributors'
                                    ? ''
                                    : '-不亮灯'}
                            </div>
                        </Option>
                    );
                })}
                {optionLight?.map((item: any) => {
                    return (
                        <Option
                            key={item.value}
                            value={item.value}
                            label={item.label}
                            disabled={item.disabled}
                        >
                            <div className="demo-option-label-item">
                                <span
                                    role="img"
                                    aria-label="China"
                                    className="option-items-img"
                                >
                                    <img
                                        src={
                                            PLATFORM_IMG[item.value]
                                        }
                                        alt=""
                                    />
                                </span>
                                {item.label}
                                {item.value === 'all' || from === 'distributors'
                                    ? ''
                                    : '-亮灯'}
                            </div>
                        </Option>
                    );
                })}
            </Select>
        );
    }
}

export default SelectPlatform;
