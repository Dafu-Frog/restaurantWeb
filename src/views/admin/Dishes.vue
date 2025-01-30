<template>
    <div class="dishes-manage">
        <div class="header">
            <h2>菜品管理</h2>
            <el-button type="primary" @click="handleAdd">
                添加菜品
            </el-button>
        </div>

        <el-table :data="dishes" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="图片" width="120">
                <template #default="{ row }">
                    <el-image :src="row.image" style="width: 60px; height: 60px" fit="cover" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column prop="price" label="价格" width="100">
                <template #default="{ row }">
                    ¥{{ row.price }}
                </template>
            </el-table-column>
            <el-table-column prop="categoryId" label="分类" width="100">
                <template #default="{ row }">
                    {{ getCategoryName(row.categoryId) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                    <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加/编辑菜品对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加菜品' : '编辑菜品'" width="500px">
            <el-form :model="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" type="textarea" />
                </el-form-item>
                <el-form-item label="价格">
                    <el-input-number v-model="form.price" :min="0" :precision="2" />
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="form.categoryId">
                        <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeUpload">
                        <img v-if="form.image" :src="form.image" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('add')
const form = ref({
    name: '',
    description: '',
    price: 0,
    categoryId: 1,
    image: ''
})

const categories = [
    { id: 1, name: '热门推荐' },
    { id: 2, name: '主食' },
    { id: 3, name: '小食' },
    { id: 4, name: '饮品' }
]

const dishes = ref([
    {
        id: 1,
        categoryId: 1,
        name: '小狗汉堡',
        description: '可爱造型的牛肉汉堡，搭配特制酱料',
        price: 28,
        image: '/dishes/burger.jpg'
    },
    {
        id: 2,
        categoryId: 1,
        name: '小狗三明治',
        description: '狗狗脸造型的三明治，搭配新鲜生菜和水果',
        price: 22,
        image: '/dishes/sandwich.jpg'
    },
    {
        id: 3,
        categoryId: 1,
        name: '小狗寿司',
        description: '可爱的狗狗造型寿司卷，搭配和风酱料',
        price: 32,
        image: '/dishes/sushi.jpg'
    },
    {
        id: 4,
        categoryId: 2,
        name: '小狗咖喱饭',
        description: '狗爪形状的咖喱配米饭，温暖可口',
        price: 26,
        image: '/dishes/curry.jpg'
    },
    {
        id: 5,
        categoryId: 2,
        name: '小狗意面',
        description: '意大利面配狗爪形状的肉丸，香浓美味',
        price: 30,
        image: '/dishes/pasta.jpg'
    },
    {
        id: 6,
        categoryId: 2,
        name: '小狗披萨',
        description: '狗狗脸造型的迷你披萨，芝士满满',
        price: 36,
        image: '/dishes/pizza.jpg'
    },
    {
        id: 7,
        categoryId: 3,
        name: '小狗薯条',
        description: '金黄酥脆的薯条，配狗爪形状番茄酱',
        price: 16,
        image: '/dishes/fries.jpg'
    },
    {
        id: 8,
        categoryId: 3,
        name: '小狗甜甜圈',
        description: '狗狗造型的甜甜圈，多种口味可选',
        price: 18,
        image: '/dishes/donut.jpg'
    },
    {
        id: 9,
        categoryId: 3,
        name: '小狗蛋糕',
        description: '可爱的狗狗脸蛋糕，松软香甜',
        price: 20,
        image: '/dishes/cake.jpg'
    },
    {
        id: 10,
        categoryId: 3,
        name: '小狗冰淇淋',
        description: '狗狗造型的冰淇淋球，多种口味',
        price: 15,
        image: '/dishes/icecream.jpg'
    },
    {
        id: 11,
        categoryId: 4,
        name: '小狗奶茶',
        description: '奶茶上有可爱的狗狗拉花，香醇丝滑',
        price: 18,
        image: '/dishes/milk-tea.jpg'
    },
    {
        id: 12,
        categoryId: 4,
        name: '小狗果汁',
        description: '新鲜水果制作，配狗爪形状的果冻',
        price: 16,
        image: '/dishes/juice.jpg'
    },
    {
        id: 13,
        categoryId: 4,
        name: '小狗咖啡',
        description: '咖啡上有可爱的狗狗拉花艺术',
        price: 20,
        image: '/dishes/coffee.jpg'
    },
    {
        id: 14,
        categoryId: 4,
        name: '小狗气泡水',
        description: '清爽的气泡水，配狗爪形状的果味糖浆',
        price: 14,
        image: '/dishes/soda.jpg'
    },
    {
        id: 15,
        categoryId: 1,
        name: '小狗火锅',
        description: '狗狗造型的个人火锅，配多种新鲜食材',
        price: 58,
        image: '/dishes/hotpot.jpg',
        isNew: true
    },
    {
        id: 16,
        categoryId: 1,
        name: '小狗便当',
        description: '可爱的狗狗饭团便当，营养均衡',
        price: 32,
        image: '/dishes/bento.jpg',
        isNew: true
    },
    {
        id: 17,
        categoryId: 2,
        name: '小狗炒饭',
        description: '狗爪形状的蛋包炒饭，搭配多种配菜',
        price: 28,
        image: '/dishes/fried-rice.jpg'
    },
    {
        id: 18,
        categoryId: 2,
        name: '小狗拉面',
        description: '热气腾腾的拉面，配狗狗造型的叉烧',
        price: 32,
        image: '/dishes/ramen.jpg'
    },
    {
        id: 19,
        categoryId: 2,
        name: '小狗饺子',
        description: '狗狗脸造型的可爱饺子，多种馅料',
        price: 26,
        image: '/dishes/dumplings.jpg'
    },
    {
        id: 20,
        categoryId: 3,
        name: '小狗布丁',
        description: '狗狗造型的奶黄布丁，口感细腻',
        price: 16,
        image: '/dishes/pudding.jpg'
    },
    {
        id: 21,
        categoryId: 3,
        name: '小狗马卡龙',
        description: '狗爪形状的马卡龙，多种口味',
        price: 22,
        image: '/dishes/macaron.jpg'
    },
    {
        id: 22,
        categoryId: 3,
        name: '小狗曲奇',
        description: '狗狗形状的黄油曲奇，香酥可口',
        price: 18,
        image: '/dishes/cookies.jpg'
    },
    {
        id: 23,
        categoryId: 4,
        name: '小狗抹茶',
        description: '抹茶上有可爱的狗狗拉花，清新醇厚',
        price: 22,
        image: '/dishes/matcha.jpg'
    },
    {
        id: 24,
        categoryId: 4,
        name: '小狗巧克力',
        description: '热巧克力配狗爪棉花糖，甜蜜温暖',
        price: 24,
        image: '/dishes/hot-chocolate.jpg'
    },
    {
        id: 25,
        categoryId: 4,
        name: '小狗冰沙',
        description: '水果冰沙配狗狗造型奶油，清爽可爱',
        price: 20,
        image: '/dishes/smoothie.jpg'
    }
])

const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : ''
}

const handleAdd = () => {
    dialogType.value = 'add'
    form.value = {
        name: '',
        description: '',
        price: 0,
        categoryId: 1,
        image: ''
    }
    dialogVisible.value = true
}

const handleEdit = (row) => {
    dialogType.value = 'edit'
    form.value = { ...row }
    dialogVisible.value = true
}

const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除该菜品吗？', '提示', {
        type: 'warning'
    }).then(() => {
        // 这里添加删除逻辑
        ElMessage.success('删除成功')
    })
}

const beforeUpload = (file) => {
    // 这里添加图片上传逻辑
    return false
}

const handleSubmit = () => {
    // 这里添加提交逻辑
    ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
    dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.dishes-manage {
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
                content: '🐶';
                margin-right: 8px;
            }
        }
    }

    .el-table {
        border-radius: var(--border-radius-medium);
        overflow: hidden;

        .el-table__header {
            background-color: #FFF0F5;
        }
    }

    .el-image {
        border-radius: var(--border-radius-small);
        transition: transform 0.3s;

        &:hover {
            transform: scale(1.1);
        }
    }

    .avatar-uploader {
        :deep(.el-upload) {
            border: 2px dashed var(--primary-color);
            border-radius: var(--border-radius-medium);
            background-color: #FFF0F5;
        }
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
}
</style>