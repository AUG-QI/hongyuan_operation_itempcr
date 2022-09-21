import React from 'react';
import { Select } from 'antd';
import './index.scss';

const { Option } = Select;

/** 平台图片 */
export const PLATFORM_IMG: any = {
    all: 'https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/all_platform_icon.png',
    douying: 'https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/douyin_logo.png',
    douyinGray: '',
    kuaishou: 'https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/kuaishou_logo.png',
    kuaishouGray: '',
    xiaohongshu: 'https://qniyong.oss-cn-hangzhou.aliyuncs.com/biyao/imgs/xiaohongshu_logo.png',
    xiaohongshuGray: '',
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
        value: 'douying',
        label: '抖音',
    },
    {
        value: 'kuaishou',
        label: '快手',
    },
    {
        value: 'xiaohongshu',
        label: '小红书',
    },
];

interface IProps {
    /** 处理选择器改变 */
    handleSelectChange: Function;
    /** 来自 */
    from? :string;
}

interface IState {
    /** 选中的值 */
    selectValues: string[];
    /** 选择方式 */
    selectMode: 'multiple' | 'tags' | any;
}

/** 平台选择器 */
class SelectPlatform extends React.Component<IProps, IState> {
    constructor (props:IProps) {
        super(props);
        this.state = {
            selectValues: ['all'],
            selectMode: 'multiple',
        };
    }
    componentDidMount (): void {
        const { from = '' } = this.props;
        if (from === 'distributors') {
            this.setState({ selectMode: '' });
        }
    }
    /**
     * 改变选择器框内容
     */
    onChange = (val: string[]) => {
        const { handleSelectChange, from } = this.props;
        const { selectValues } = this.state;
        if (from === 'productList') {
            this.setState({ selectValues: val });
            handleSelectChange(val);
            return;
        }
        let newSelectValues = val;
        // 如果之前数据里面有选择全部，又选择其他的了，就删掉全部选项
        if (selectValues.includes('all') && val.length) {
            newSelectValues = val.filter(item => item !== 'all');
        } else if (val.includes('all') || !val.length) {
            // 如果是后来选中全部，就清空之前的
            newSelectValues = ['all'];
        }
        this.setState({ selectValues: newSelectValues });
        handleSelectChange(newSelectValues);
    }

    render () {
        const { selectValues, selectMode } = this.state;
        return (
            <Select
                mode={selectMode}
                optionLabelProp='label'
                value={selectValues}
                onChange={this.onChange}
                maxTagCount='responsive'
                style={{ width: 200 }}
                optionFilterProp='label'
                showArrow={true}
                notFoundContent='暂无搜索内容'
            >
                {PLATFORM_OPTIONS.map((item) => {
                    return (
                        <Option
                            key={item.value}
                            value={item.value}
                            label={item.label}
                        >
                            <div className='demo-option-label-item'>
                                <span role='img' aria-label="China" className='option-items-img'>
                                    <img src={PLATFORM_IMG[item.value]} alt='' />
                                </span>
                                {item.label}{item.value === 'all' ? '' : '-不亮灯'}
                            </div>
                        </Option>
                    );
                })}
            </Select>
        );
    }
}

export default SelectPlatform;
