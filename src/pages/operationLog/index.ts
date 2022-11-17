import moment from "_moment@2.29.4@moment";
import { failTypeRender } from "../abnormalPurchaseOrderList";
import { compileFeishuGroup } from "../feishuRobotManagementLog/robotList";
import { shopTypeRender } from "./component/logSearch";
import { errorNumLink } from "./component/logTable";


/** 操作日志数据 */
export const OPERATION_LOG_DATA =  {
    /** 铺货失败日志搜索数据 */
    SHELVES_FAILURE_SEARCH_LIST: [
        {
            title: '电商平台名',
            key: 'shop_type',
        },
        {
            title: '分销商ID',
            key: 'seller_id',
        },
        {
            title: '分销商店铺名',
            key: 'shop_name',
        },
        {
            title: '必要商品ID',
            key: 'origin_num_iid',
        },
        {
            title: '必要商品名',
            key: 'origin_title',
        },
        {
            title: '失败原因',
            key: 'distribute_memo',
        },
        {
            title: '铺货时间',
            key: 'month',
        },
    ],
    /** 铺货失败日志表格默认数据 */
    SHELVES_FAILURE_TABLE_DEFAULT_LIST: [
        {
            title: '电商平台名',
            dataIndex: 'store_id',
            render: (text: string) => shopTypeRender(text),
            width: 150,
        },
        {
            title: '失败原因',
            dataIndex: 'error_msg',
        },
        {
            title: '失败个数',
            dataIndex: 'num',
            width: 120,
            render: (text: string, data: any) => errorNumLink(text, data),
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            width: 240,
        },
    ],
    /** 铺货失败日志表格默认数据 */
    SHELVES_FAILURE_TABLE_ALL_LIST: [
        {
            title: '电商平台名',
            dataIndex: 'shop_type',
            render: (text: string) => shopTypeRender(text),
        },
        {
            title: '分销商ID',
            dataIndex: 'seller_nick',
        },
        {
            title: '分销商店铺名',
            dataIndex: 'shop_name',
        },
        {
            title: '必要商品ID',
            dataIndex: 'origin_num_iid',
        },
        {
            title: '必要商品名',
            dataIndex: 'origin_title',
        },
        {
            title: '失败原因',
            dataIndex: 'distribute_mome',
        },
        {
            title: '铺货时间',
            dataIndex: 'start_time',
        },
    ],
    /** 库存同步日志搜索数据 */
    INVENTORY_SYNCHRONIZATION_SEARCH_LIST: [
        {
            title: '电商平台名',
            key: 'shop_type',
        },
        {
            title: '分销商ID',
            key: 'seller_id',
        },
        {
            title: '分销商店铺名',
            key: 'shop_name',
        },
        {
            title: '必要商品ID',
            key: 'origin_num_iid',
        },
        {
            title: '必要商品名',
            key: 'origin_title',
        },
        {
            title: '库存同步时间',
            key: 'time',
        },
    ],
    /** 库存同步日志表格数据 */
    INVENTORY_SYNCHRONIZATION_ALL_LIST: [
        {
            title: '电商平台名',
            dataIndex: 'shop_type',
            render: (text: string) => shopTypeRender(text),
            width: 150,
        },
        {
            title: '分销商ID',
            dataIndex: 'seller_nick',
            width: 150,
        },
        {
            title: '分销商店铺名',
            dataIndex: 'shop_name',
            width: 180,
        },
        {
            title: '必要商品ID',
            dataIndex: 'origin_num_iid',
            width: 180,
        },
        {
            title: '必要商品名',
            dataIndex: 'title',
            width: 180,
        },
        {
            title: '货源变动情况',
            dataIndex: 'result',
            width: 180,
        },
        {
            title: '货源同步情况',
            dataIndex: 'status',
            render: (text: string | number) => {
                return text == 1 ? '成功' : '失败';
            },
            width: 180,
        },
        {
            title: '库存同步时间',
            dataIndex: 'create_time',
            width: 180,
        },
    ],
    /** 管控下架日志搜索数据 */
    CONTROLS_SHELVES_SEARCH_LIST: [
        {
            title: '电商平台名',
            key: 'platformName',
        },
        {
            title: '必要商品ID',
            key: 'biyaoItemId',
        },
        {
            title: '必要商品名',
            key: 'biyaoItemName',
        },
        {
            title: '分销商ID',
            key: 'distributorId',
        },
        {
            title: '分销商店铺名',
            key: 'distributorShopName',
        },
        {
            title: '操作账号',
            key: 'operationAccount',
        },
        {
            title: '下架时间',
            key: 'removedTime',
        },
    ],
    /** 管控下架日志表格数据 */
    CONTROLS_SHELVES_TABLE_ALL_LIST: [
        {
            title: '电商平台名',
            dataIndex: 'platformName',
            render: (text: string) => shopTypeRender(text),
        },
        {
            title: '必要商品ID',
            dataIndex: 'biyaoItemId',
        },
        {
            title: '必要商品名',
            dataIndex: 'biyaoItemName',
        },
        {
            title: '分销商ID',
            dataIndex: 'distributorId',
        },
        {
            title: '分销商店铺名',
            dataIndex: 'distributorShopName',
        },
        {
            title: '操作账号',
            dataIndex: 'operationAccount',
        },
        {
            title: '操作结果',
            dataIndex: 'operationResult',
            render: (text: string | number) => {
                if (text !== null) {
                    return text == 1 ? '成功' : '失败';
                }
                return text;
            },
        },
        {
            title: '结果详情',
            dataIndex: 'operationResultDetail',
        },
        {
            title: '下架时间',
            dataIndex: 'removedTime',
        },
    ],
    /** 取消代销日志搜索数据 */
    CANCEL_INSTEAD_SALES_SEARCH_LIST: [
        {
            title: '电商平台名',
            key: 'shop_type',
        },
        {
            title: '必要商品ID',
            key: 'origin_num_iid',
        },
        {
            title: '必要商品名',
            key: 'title',
        },
        {
            title: '平台商品ID',
            key: 'num_iid',
        },
        {
            title: '分销商ID',
            key: 'retail_id',
        },
        {
            title: '分销商名字',
            key: 'retail_name',
        },
        {
            title: '取消代销时间',
            key: 'time',
        },
    ],
    /** 取消代销日志表格数据 */
    CANCEL_INSTEAD_SALES_TABLE_ALL_LIST: [
        {
            title: '电商平台名',
            dataIndex: 'shop_type',
            render: (text: string) => shopTypeRender(text),
        },
        {
            title: '必要商品ID',
            dataIndex: 'origin_num_iid',
        },
        {
            title: '必要商品名',
            dataIndex: 'origin_title',
        },
        {
            title: '平台商品ID',
            dataIndex: 'num_iid',
        },
        {
            title: '平台商品名',
            dataIndex: 'title',
        },
        {
            title: '分销商ID',
            dataIndex: 'user_id',
        },
        {
            title: '分销商名字',
            dataIndex: 'user_name',
        },
        {
            title: '取消代销时间',
            dataIndex: 'gmt_create',
        },
    ],
    /** 商家订单失败日志搜索数据 */
    MERCHANT_ORDER_FAILURE_SEARCH_LIST: [
        {
            title: '操作时间',
            key: 'time',
        },
        {
            title: '失败类型',
            key: 'orderFailureType',
        },
        {
            title: '鸿源订单编号',
            key: 'hyTid',
        },
        {
            title: '电商平台单号',
            key: 'platformTid',
        },
        {
            title: '分销商名',
            key: 'distributorNick',
        },
        {
            title: '电商平台名',
            key: 'storeId',
        },
        {
            title: '商家名',
            key: 'purchaseSellerNick',
        },
        {
            title: '商家ID',
            key: 'purchaseId',
        },
    ],
    /** 商家订单失败日志表格数据 */
    MERCHANT_ORDER_FAILURE_TABLE_ALL_LIST: [
        {
            title: '操作时间',
            dataIndex: 'operationalTime',
            width: 140,
            id: 2,
            key: 2,
        },
        {
            title: '失败类型',
            dataIndex: 'orderFailureType',
            render: (text: string) => shopTypeRender(text, 'orderFailureType'),
            width: 120,
            id: 3,
            key: 3,
        },
        {
            title: '错误码',
            dataIndex: 'errorCode',
            width: 120,
            id: 4,
            key: 4,
        },
        {
            title: '错误原因',
            dataIndex: 'errorCause',
            width: 180,
            id: 5,
            key: 5,
        },
        {
            title: '鸿源订单编号',
            dataIndex: 'hyTid',
            width: 140,
            id: 6,
            key: 6,
        },
        {
            title: '电商平台单号',
            dataIndex: 'platformTid',
            width: 140,
            id: 7,
            key: 7,
        },
        {
            title: '分销商名',
            dataIndex: 'distributorNick',
            width: 120,
            id: 8,
            key: 8,
        },
        {
            title: '分销商店铺名',
            dataIndex: 'distributorShopName',
            width: 120,
            id: 9,
            key: 9,
        },
        {
            title: '电商平台名',
            dataIndex: 'storeId',
            render: (text: string) => shopTypeRender(text, 'storeId'),
            width: 120,
            id: 1,
            key: 1,
        },
        {
            title: '商家名',
            dataIndex: 'purchaseSellerNick',
            width: 120,
            id: 10,
            key: 10,
        },
        {
            title: '商家ID',
            dataIndex: 'purchaseId',
            width: 120,
            id: 11,
            key: 11,
        },
        {
            title: '商家仓库ID',
            dataIndex: 'purchaseWarehouseId',
            width: 120,
            id: 12,
            key: 12,
        },
        {
            title: '仓库名',
            dataIndex: 'purchaseWarehouseName',
            width: 120,
            id: 13,
            key: 13,
        },
    ],
    /** 售后日志搜索数据 */
    AFTER_SALES_SEARCH_LIST: [
        {
            title: '电商平台名',
            key: 'storeId',
        },
        {
            title: '分销商名',
            key: 'distributorNick',
        },
        {
            title: '分销商店铺名',
            key: 'distributorShopName',
        },
        {
            title: '鸿源订单编号',
            key: 'hyTid',
        },
        {
            title: '平台订单编号',
            key: 'platformTid',
        },
        {
            title: '受理单编号',
            key: 'hyReferenceNum',
        },
        {
            title: '平台受理单编号',
            key: 'platformReferenceNum',
        },
        {
            title: '操作时间',
            key: 'time',
        },
    ],
    /** 售后日志表格数据 */
    AFTER_SALES_TABLE_ALL_LIST: [
        {
            title: '电商平台名',
            dataIndex: 'storeId',
            render: (text: string) => shopTypeRender(text, 'storeId'),
            width: 120,
            key: '1',
        },
        {
            title: '分销商ID',
            dataIndex: 'distributorId',
            width: 120,
            key: '2',
        },
        {
            title: '分销商名',
            dataIndex: 'distributorNick',
            width: 120,
            key: '3',
        },
        {
            title: '分销商店铺名',
            dataIndex: 'distributorShopName',
            width: 130,
            key: '4',
        },
        {
            title: '鸿源订单编号',
            dataIndex: 'hyTid',
            width: 140,
            key: '5',
        },
        {
            title: '平台订单编号',
            dataIndex: 'platformTid',
            width: 140,
            key: '6',
        },
        {
            title: '受理单编号',
            dataIndex: 'hyReferenceNum',
            width: 140,
            key: '7',
        },
        {
            title: '平台受理单编号',
            dataIndex: 'platformReferenceNum',
            width: 140,
            key: '8',
        },
        {
            title: '操作动作',
            dataIndex: 'operationalMotion',
            width: 120,
            key: '9',
        },
        {
            title: '操作结果',
            dataIndex: 'operationalResult',
            render: (text: string | number) => {
                return  text == 1 ? '成功' : '失败';
            },
            width: 120,
        },
        {
            title: '错误码',
            dataIndex: 'errorCode',
            width: 120,
        },
        {
            title: '错误原因',
            dataIndex: 'errorCause',
            width: 120,
        },
        {
            title: '操作内容',
            dataIndex: 'operationalContent',
            width: 160,
        },
        {
            title: '操作原因',
            dataIndex: 'operationalCause',
            width: 160,
        },
        {
            title: '操作时间',
            dataIndex: 'operationalTime',
            width: 140,
        },
        {
            title: '平台售后事件发生时间',
            dataIndex: 'platformAfterSalesCreateTime',
            width: 180,
        },
        {
            title: '商家ID',
            dataIndex: 'purchaseId',
            width: 120,
        },
        {
            title: '商家名',
            dataIndex: 'purchaseSellerNick',
            width: 120,
        },
        {
            title: '商家仓库ID',
            dataIndex: 'purchaseWarehouseId',
            width: 120,
        },
        {
            title: '仓库名',
            dataIndex: 'purchaseWarehouseName',
            width: 120,
        },
        {
            title: '当前退货地址',
            dataIndex: 'currentSalesReturnAddress',
            width: 150,
        },
    ],
    /** 采购单异常日志搜索数据 */
    ABNORMAL_PURCHASE_ORDER_SEARCH_LIST: [
        {
            title: '电商平台名',
            key: 'storeId',
        },
        {
            title: '操作时间',
            key: 'time',
        },
        {
            title: '鸿源订单编号',
            key: 'hyTid',
        },
        {
            title: '电商平台单号',
            key: 'platformTid',
        },
        {
            title: '分销商名',
            key: 'distributorNick',
        },
        {
            title: '分销商ID',
            key: 'distributorId',
        },
        {
            title: '异常情况',
            key: 'exceptionReason',
        },
    ],
    /** 采购单异常日志表格数据 */
    ABNORMAL_PURCHASE_ORDER_TABLE_ALL_LIST: [
        {
            title: '操作时间',
            dataIndex: 'eventOccurrenceTime',
            width: 180,
            id: 10,
        },
        {
            title: '异常情况',
            dataIndex: 'exceptionReason',
            width: 180,
            id: 2,
        },
        {
            title: '错误码',
            dataIndex: 'errorCode',
            width: 120,
            id: 3,
        },
        {
            title: '错误信息',
            dataIndex: 'errorCause',
            width: 180,
            id: 4,
        },
        {
            title: '鸿源订单编号',
            dataIndex: 'hyTid',
            width: 180,
            id: 5,
        },
        {
            title: '电商平台单号',
            dataIndex: 'platformTid',
            width: 180,
            id: 5,
        },
        {
            title: '分销商名',
            dataIndex: 'distributorNick',
            width: 150,
            id: 6,
        },
        {
            title: '分销商ID',
            dataIndex: 'distributorId',
            width: 180,
            id: 7,
        },
        {
            title: '分销商店铺名',
            dataIndex: 'distributorShopName',
            width: 180,
            id: 8,
        },
        {
            title: '电商平台名',
            dataIndex: 'storeId',
            render: (text: string) => shopTypeRender(text, 'storeId'),
            width: 120,
            id: 1,
        },
        {
            title: '商家ID',
            dataIndex: 'purchaseId',
            width: 180,
            id: 9,
        },

    ],
    /** 取消采购日志搜索数据 */
    CANCEL_PURCHASE_SEARCH_LIST: [
        {
            title: '操作时间',
            key: 'time',
        },
        {
            title: '鸿源订单编号',
            key: 'hyTid',
        },
        {
            title: '电商平台单号',
            key: 'platformTid',
        },
        {
            title: '分销商名',
            key: 'distributorNick',
        },
        {
            title: '分销商ID',
            key: 'distributorId',
        },
        {
            title: '电商平台名',
            key: 'storeId',
        },
    ],
    /** 取消采购日志列表数据 */
    CANCEL_PURCHASE_TABLE_ALL_LIST: [
        {
            title: '取消采购时间',
            dataIndex: 'cancellationPurchaseTime',
            id: 2,
        },
        {
            title: '取消原因',
            dataIndex: 'cancellationReason',
            id: 3,
        },
        {
            title: '鸿源订单编号',
            dataIndex: 'hyTid',
            id: 4,
        },
        {
            title: '商家ID',
            dataIndex: 'purchaseId',
            id: 5,
        },
        {
            title: '电商平台单号',
            dataIndex: 'platformTid',
            id: 6,
        },
        {
            title: '分销商名',
            dataIndex: 'distributorNick',
            id: 7,
        },
        {
            title: '分销商ID',
            dataIndex: 'distributorId',
            id: 8,
        },
        {
            title: '分销商店铺名',
            dataIndex: 'distributorShopName',
            id: 9,
        },
        {
            title: '电商平台名',
            dataIndex: 'storeId',
            render: (text: string) => shopTypeRender(text, 'storeId'),
            id: 1,
        },

    ],
    /** 受理单异常日志搜索数据 */
    ACCEPT_SINGLE_EXCEPTION_SEARCH_LIST: [
        {
            title: '电商平台名',
            key: 'storeId',
        },
        {
            title: '受理单编号',
            key: 'hyReferenceNum',
        },
        {
            title: '平台受理单编号',
            key: 'platformReferenceNum',
        },
        {
            title: '鸿源订单编号',
            key: 'hyTid',
        },
        {
            title: '电商平台单号',
            key: 'platformTid',
        },
        {
            title: '分销商名',
            key: 'distributorNick',
        },
        {
            title: '分销商店铺名',
            key: 'distributorShopName',
        },
        {
            title: '事件发生时间',
            key: 'time',
        },
    ],
    /** 受理单异常日志列表数据 */
    ACCEPT_SINGLE_EXCEPTION_TABLE_ALL_LIST: [
        {
            title: '电商平台名',
            dataIndex: 'storeId',
            render: (text: string) => shopTypeRender(text, 'storeId'),
            width: 120,
            id: 1,
        },
        {
            title: '异常情况',
            dataIndex: 'exceptionalSituation',
            width: 120,
            id: 2,
        },
        {
            title: '错误码',
            dataIndex: 'errorCode',
            width: 120,
            id: 3,
        },
        {
            title: '错误信息',
            dataIndex: 'errorCause',
            width: 120,
            id: 4,
        },
        {
            title: '受理单编号',
            dataIndex: 'hyReferenceNum',
            width: 140,
            id: 5,
        },
        {
            title: '平台受理单编号',
            dataIndex: 'platformReferenceNum',
            width: 140,
            id: 6,
        },
        {
            title: '鸿源订单编号',
            dataIndex: 'hyTid',
            width: 140,
            id: 7,
        },
        {
            title: '电商平台单号',
            dataIndex: 'platformTid',
            width: 140,
            id: 8,
        },
        {
            title: '商家ID',
            dataIndex: 'purchaseId',
            width: 120,
            id: 9,
        },
        {
            title: '分销商名',
            dataIndex: 'distributorNick',
            width: 120,
            id: 10,
        },
        {
            title: '分销商店铺名',
            dataIndex: 'distributorShopName',
            width: 120,
            id: 11,
        },
        {
            title: '分销商ID',
            dataIndex: 'distributorId',
            width: 120,
            id: 12,
        },
        {
            title: '事件发生时间',
            dataIndex: 'platformAfterSalesCreateTime',
            width: 140,
            id: 13,
        },
    ],
    ABNORMAL_PURCHASE_ORDER_LIST_SEARCH_LIST: [
        {
            title: '异常类型',
            key: 'failType',
        },
        {
            title: '采购单编号',
            key: 'originIdList',
        },
        {
            title: '采购单创建时间',
            key: 'time',
        },
        {
            title: '电商平台名',
            key: 'sourceStoreId',
        },
        {
            title: '电商平台单号',
            key: 'tidList',
        },
    ],
    /** 异常采购单列表 */
    ABNORMAL_PURCHASE_ORDER_LIST_TABLE_ALL_LIST: [
        {
            title: '采购单编号',
            dataIndex: 'originId',
            width: 200,
        },
        {
            title: '异常类型',
            dataIndex: 'failType',
            width: 150,
            render: (text: string) => failTypeRender(text, 'failType'),
        },
        {
            title: '错误原因',
            dataIndex: 'failReason',
            width: 150,
        },
        {
            title: '电商平台单号',
            dataIndex: 'tid',
            width: 200,
        },
        {
            title: '分销商名',
            dataIndex: 'distributeName',
            width: 150,
        },
        {
            title: '分销商ID',
            dataIndex: 'distributeSellerId',
            width: 150,
        },
        {
            title: '分销商店铺名',
            dataIndex: 'distributeSellerNick',
            width: 170,
        },
        {
            title: '电商平台名',
            dataIndex: 'sourceStoreId',
            width: 150,
            render: (text: string) => shopTypeRender(text, 'storeId'),
        },
        {
            title: '待采购商品ID',
            dataIndex: 'originSpuId',
            width: 150,
        },
        {
            title: '商品SKUID',
            dataIndex: 'originSkuId',
            width: 200,
        },
        {
            title: '必要商品名',
            dataIndex: 'originTitle',
            width: 150,
        },
        {
            title: '规格名称',
            dataIndex: 'originSkuName',
            width: 150,
        },
        {
            title: '数量',
            dataIndex: 'skuNum',
            width: 120,
        },
        {
            title: '商家(工厂)ID',
            dataIndex: 'supplierSellerId',
            width: 150,
        },
        {
            title: '商家(工厂)名称',
            dataIndex: 'supplierSellerNick',
            width: 150,
        },
        {
            title: '创建时间',
            dataIndex: 'created',
            width: 180,
        },
        {
            title: '操作',
            dataIndex: 'failType',
            width: 120,
            render: (text: string, record: any) => failTypeRender(text, 'operation', record),
            fixed: 'right',
        },
    ],
    /** 飞书机器人操作日志搜索 */
    FEISHU_ROBOT_MANAGEMENT_OPERATION_SEARCH_LIST: [
        {
            title: '分销商ID',
            key: 'distributorId',
        },
        {
            title: '分销商名称',
            key: 'distributorNick',
        },
        {
            title: '店铺名称',
            key: 'distributorShopName',
        },
        {
            title: '关联飞书群',
            key: 'isAssociated',
        },
    ],
    /** 飞书机器人操作日志表头数据 */
    FEISHU_ROBOT_MANAGEMENT_OPERATION_TABLE_ALL_LIST: [
        {
            title: '分销商ID',
            dataIndex: 'distributorId',
            key: 'distributorId',
            width: 150,
        },
        {
            title: '分销商名称',
            dataIndex: 'distributorNick',
            key: 'distributorNick',
            width: 180,
        },
        {
            title: '平台',
            dataIndex: 'storeId',
            key: 'storeId',
            width: 120,
            render: (text: string) => shopTypeRender(text, 'storeId'),
        },
        {
            title: '分销商店铺名',
            dataIndex: 'distributorShopName',
            key: 'distributorShopName',
            width: 180,
        },
        {
            title: '飞书群',
            dataIndex: 'feishuGroupName',
            key: 'feishuGroupName',
            width: 200,
        },
        {
            title: '操作',
            dataIndex: 'created',
            key: 'created',
            width: 80,
            render: (text: string, record: any) => compileFeishuGroup(record),
            fixed: 'right',
        },
    ],
    /** 飞书机器人操作日志搜索 */
    FEISHU_ROBOT_MANAGEMENT_OPERATION_CHECK_SEARCH_LIST: [
        {
            title: '分销商ID',
            key: 'distributorId',
        },
        {
            title: '分销商名称',
            key: 'distributorNick',
        },
        {
            title: '店铺名称',
            key: 'distributorShopName',
        },
    ],
    /** 飞书机器人操作日志表头数据 */
    FEISHU_ROBOT_MANAGEMENT_OPERATION_TABLE_CHECK_LIST: [
        {
            title: '分销商ID',
            dataIndex: 'distributorId',
            key: 'distributorId',
            width: 150,
        },
        {
            title: '分销商名称',
            dataIndex: 'distributorNick',
            key: 'distributorNick',
            width: 180,
        },
        {
            title: '平台',
            dataIndex: 'storeId',
            key: 'storeId',
            width: 120,
            render: (text: string) => shopTypeRender(text, 'storeId'),
        },
        {
            title: '分销商店铺名',
            dataIndex: 'distributorShopName',
            key: 'distributorShopName',
            width: 180,
        },
        {
            title: '飞书群',
            dataIndex: 'feishuGroupName',
            key: 'feishuGroupName',
            width: 200,
        },
        {
            title: 'webhook',
            dataIndex: 'webhook',
            key: 'webhook',
            width: 180,
        },
    ],
    /** 飞书机器人修改日志搜索 */
    FEISHU_ROBOT_MANAGEMENT_MODIFY_SEARCH_LIST: [
        {
            title: '操作时间',
            key: 'time',
        },
        {
            title: '分销商ID',
            key: 'distributorId',
        },
        {
            title: '运营账号',
            key: 'operationAccount',
        },
    ],
    /** 飞书机器人修改日志表头数据 */
    FEISHU_ROBOT_MANAGEMENT_MODIFY_TABLE_ALL_LIST: [
        {
            title: '运营账号',
            dataIndex: 'operationAccount',
            key: 'operationAccount',
            width: 150,
        },
        {
            title: '分销商ID',
            dataIndex: 'distributorId',
            key: 'distributorId',
            width: 180,
        },
        {
            title: '分销商名称',
            dataIndex: 'distributorNick',
            key: 'distributorNick',
            width: 180,
        },
        {
            title: '平台',
            dataIndex: 'storeId',
            key: 'storeId',
            width: 120,
            render: (text: string) => shopTypeRender(text, 'storeId'),
        },
        {
            title: '店铺名称',
            dataIndex: 'platformShopName',
            key: 'platformShopName',
            width: 180,
        },
        {
            title: '操作内容',
            dataIndex: 'operationContent',
            key: 'operationContent',
            width: 240,
        },
        {
            title: '操作时间',
            dataIndex: 'operationTime',
            key: 'operationTime',
            width: 180,
        },
        {
            title: '操作IP',
            dataIndex: 'operationIp',
            key: 'operationIp',
            width: 180,
        },
    ],
};

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
/** 获取默认时间 */
export const getSpecifiedTime = (type: string = '') => {
    const date = new Date();
    let formateDate: any = [];
    let momentTime = null;
    // 需要选择范围时间
    if (type === 'month') {
        formateDate = getFormateDate(date, type);
        momentTime = moment(formateDate, dateFormat);
    } else {
        formateDate = getDateRange(date, type);
        // 开始时间
        momentTime = [moment(formateDate[0], dateFormat), moment(formateDate[1], dateFormat)];
    }
    return {
        momentTime,
        formateDate,
    };
};

/**
 * 获取时间范围
 * @param dateNow
 * @param intervalDays
 * @returns
 */
const getDateRange = (dateNow: any, intervalDays: any) => {
    const oneDayTime = 24 * 60 * 60 * 1000;
    const list = [];
    const lastDay = new Date(dateNow.getTime() - (intervalDays * oneDayTime));
    list.push(`${getFormateDate(lastDay)} 00:00:00`);
    list.push(`${getFormateDate(dateNow)} 23:59:59`);
    return list;
};

/**
 * 获取时间
 * @param time
 * @param type
 * @returns
 */
const getFormateDate = (time: any, type = '') => {
    const year = time.getFullYear();
    const month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
    if (type === 'month') {
        return year + '-' + month;
    }
    const day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    return year + '-' + month + '-' + day;
};
