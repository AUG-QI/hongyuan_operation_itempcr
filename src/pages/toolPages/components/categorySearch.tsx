// @ts-nocheck
import { Cascader } from 'antd';
import React from 'react';
import { getCategoryOptions } from '../../commodityManagement/api';

interface CategorySearchProps {
    /** 选中的类目 */
    selectCategory: string | number[];
    /** 改变后回调 */
    handleChangeCategory: (val: string) => void;
    /** 处理关闭弹框回调 */
    handleDropdownCategoryCallback: () => void;
}

interface CategorySearchState {
    /** 类目 */
    categoryoptions: any;
}

class CategorySearch extends React.Component<CategorySearchProps, CategorySearchState> {
    constructor (props: CategorySearchProps) {
        super(props);
        this.state = {
            categoryoptions: [],
        };
    }
    componentDidMount (): void {
        // 获取类目属性
        this.getCategoryoptions();
    }
    getCategoryoptions = async () => {
        const categoryoptions: any = await getCategoryOptions();
        if (!categoryoptions.length) {
            return;
        }
        this.setState({ categoryoptions });
    }
    handleChangeCategory = (val) => {
        const { handleChangeCategory } = this.props;
        const newCids = val?.map((item: any) => item[item?.length - 1]) || [];
        handleChangeCategory?.(val, newCids);
    }
    render () {
        const { selectCategory, handleDropdownCategoryCallback = () => {} } = this.props;
        const { categoryoptions } = this.state;
        return (
            <Cascader
                style={{ width: '300px' }}
                options={categoryoptions}
                onChange={this.handleChangeCategory}
                allowClear={false}
                multiple
                maxTagCount="responsive"
                fieldNames={{
                    label: 'categoryName',
                    value: 'categoryId',
                }}
                value={selectCategory}
                showCheckedStrategy={'SHOW_CHILD'}
                onDropdownVisibleChange={handleDropdownCategoryCallback}
            />
        );
    }
}

export default CategorySearch;
