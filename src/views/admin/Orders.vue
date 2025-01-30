<template>
    <div class="orders-manage">
        <div class="header">
            <h2>订单管理</h2>
            <el-select v-model="status" placeholder="订单状态" clearable>
                <el-option label="全部" value="" />
                <el-option label="待处理" value="pending" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
            </el-select>
        </div>

        <el-table :data="filteredOrders" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="订单号" width="180" />
            <el-table-column prop="time" label="下单时间" width="180" />
            <el-table-column label="订单内容" min-width="300">
                <template #default="{ row }">
                    <div v-for="item in row.items" :key="item.id" class="order-item">
                        {{ item.name }} x{{ item.count }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="total" label="金额" width="100">
                <template #default="{ row }">
                    ¥{{ row.total }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">
                        {{ row.status }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                    <el-button v-if="row.status === '待处理'" type="success" link @click="handleComplete(row)">
                        完成订单
                    </el-button>
                    <el-button v-if="row.status === '待处理'" type="danger" link @click="handleCancel(row)">
                        取消订单
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const status = ref('')

const orders = ref([
    {
        id: 'ORD20240301001',
        status: '已完成',
        time: '2024-03-01 12:30',
        total: 88,
        items: [
            { id: 1, name: '小狗汉堡', count: 2, price: 28 },
            { id: 2, name: '小狗薯条', count: 2, price: 16 }
        ]
    },
    {
        id: 'ORD20240301002',
        status: '待处理',
        time: '2024-03-01 13:45',
        total: 75,
        items: [
            { id: 3, name: '小狗意面', count: 2, price: 26 },
            { id: 4, name: '小狗奶茶', count: 1, price: 15 }
        ]
    }
])

const filteredOrders = computed(() => {
    if (!status.value) return orders.value
    return orders.value.filter(order => order.status === status.value)
})

const getStatusType = (status) => {
    switch (status) {
        case '待处理':
            return 'warning'
        case '已完成':
            return 'success'
        case '已取消':
            return 'danger'
        default:
            return 'info'
    }
}

const handleComplete = (row) => {
    ElMessageBox.confirm('确定要完成该订单吗？', '提示').then(() => {
        row.status = '已完成'
        ElMessage.success('订单已完成')
    })
}

const handleCancel = (row) => {
    ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
        type: 'warning'
    }).then(() => {
        row.status = '已取消'
        ElMessage.success('订单已取消')
    })
}
</script>

<style lang="scss" scoped>
.orders-manage {
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h2 {
            margin: 0;
            color: var(--primary-color);
            font-size: 24px;

            &::before {
                content: '📋';
                margin-right: 8px;
            }
        }
    }

    .el-table {
        border-radius: var(--border-radius-medium);
        overflow: hidden;

        .el-tag {
            border-radius: var(--border-radius-small);

            &.el-tag--success {
                background-color: var(--success-color);
                border-color: var(--success-color);
            }

            &.el-tag--warning {
                background-color: var(--warning-color);
                border-color: var(--warning-color);
            }

            &.el-tag--danger {
                background-color: var(--danger-color);
                border-color: var(--danger-color);
            }
        }
    }

    .order-item {
        margin-bottom: 4px;
        color: #606266;
        position: relative;
        padding-left: 20px;

        &::before {
            content: '🍽️';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
        }
    }
}
</style>