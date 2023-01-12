import React from 'react';
import { CloseOutlined } from '@ant-design/icons';

/** 关闭弹框 */
const closeEditDialog = () => {

};

/** 编辑弹框 */
function EditDialog () {
    return <div className="edit-dialog">
        <span
            className={'close-outlined'}
            onClick={closeEditDialog}
        >
            <CloseOutlined />
        </span>
    </div>;
}

export default EditDialog;
