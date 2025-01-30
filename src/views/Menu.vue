<template>
    <div class="app-container">
        <!-- 隐藏的背景音乐播放器 -->
        <audio ref="audioRef" loop style="display: none">
            <source src="//music.163.com/song/media/outer/url?id=2645297102.mp3" type="audio/mpeg">
        </audio>

        <!-- 顶部导航栏 -->
        <header class="header">
            <div class="logo">
                <img src="../assets/images/logo.png" alt="Logo">
                <span>小狗餐厅</span>
            </div>
            <nav class="nav">
                <el-dropdown @command="handleCommand">
                    <span class="user-menu">
                        {{ username }}
                        <el-icon>
                            <ArrowDown />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </nav>
        </header>

        <!-- 主要内容区 -->
        <main class="main">
            <div class="menu-container">
                <div class="categories">
                    <el-radio-group v-model="currentCategory">
                        <el-radio-button v-for="cat in categories" :key="cat.id" :label="cat.id">
                            {{ cat.name }}
                        </el-radio-button>
                    </el-radio-group>
                </div>

                <div class="dishes-grid">
                    <el-card v-for="dish in currentDishes" :key="dish.id" class="dish-card"
                        :body-style="{ padding: '0px' }">
                        <div class="dish-image-container">
                            <img :src="dish.image" class="dish-image">
                            <div class="dish-tag" v-if="dish.isNew">新品</div>
                        </div>
                        <div class="dish-info">
                            <h3>{{ dish.name }}</h3>
                            <p class="description">{{ dish.description }}</p>
                            <div class="price-action">
                                <span class="price">¥{{ dish.price }}</span>
                                <div class="action-buttons">
                                    <el-button v-if="!dish.count" type="primary" size="small" round
                                        @click="addToCart(dish)">
                                        加入购物车
                                    </el-button>
                                    <div v-else class="quantity-control">
                                        <el-button type="primary" size="small" circle @click="decreaseCount(dish)">
                                            <el-icon>
                                                <Minus />
                                            </el-icon>
                                        </el-button>
                                        <span class="count">{{ dish.count }}</span>
                                        <el-button type="primary" size="small" circle @click="increaseCount(dish)">
                                            <el-icon>
                                                <Plus />
                                            </el-icon>
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>

                <!-- 购物车按钮 -->
                <div class="cart-button" @click="drawerVisible = true" v-if="cartStore.totalCount">
                    <el-badge :value="cartStore.totalCount" :max="99">
                        <el-button type="primary" size="large" round>
                            <el-icon>
                                <ShoppingCart />
                            </el-icon>
                            购物车 ¥{{ cartStore.totalPrice }}
                        </el-button>
                    </el-badge>
                </div>

                <!-- 购物车抽屉 -->
                <el-drawer v-model="drawerVisible" title="购物车" size="380px" :with-header="false">
                    <div class="cart-drawer">
                        <div class="cart-header">
                            <h3>购物车</h3>
                            <el-button type="text" @click="cartStore.clearCart">清空</el-button>
                        </div>
                        <div class="cart-items" v-if="cartStore.items.length">
                            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
                                <div class="item-info">
                                    <h4>{{ item.name }}</h4>
                                    <span class="price">¥{{ item.price }}</span>
                                </div>
                                <div class="quantity-control">
                                    <el-button type="primary" size="small" circle @click="decreaseCount(item)">
                                        <el-icon>
                                            <Minus />
                                        </el-icon>
                                    </el-button>
                                    <span class="count">{{ item.count }}</span>
                                    <el-button type="primary" size="small" circle @click="increaseCount(item)">
                                        <el-icon>
                                            <Plus />
                                        </el-icon>
                                    </el-button>
                                </div>
                            </div>
                        </div>
                        <el-empty v-else description="购物车是空的" />
                        <div class="cart-footer" v-if="cartStore.items.length">
                            <div class="total">
                                <span>合计</span>
                                <span class="price">¥{{ cartStore.totalPrice }}</span>
                            </div>
                            <el-button type="primary" size="large" @click="handleCheckout">去结算</el-button>
                        </div>
                    </div>
                </el-drawer>

                <!-- 订单抽屉 -->
                <el-drawer v-model="orderDrawerVisible" title="我的订单" size="480px" :with-header="false">
                    <div class="order-drawer">
                        <div class="order-header">
                            <h3>我的订单</h3>
                        </div>
                        <div class="order-list">
                            <el-card v-for="order in orders" :key="order.id" class="order-card">
                                <div class="order-info">
                                    <span class="order-id">订单号：{{ order.id }}</span>
                                    <span class="order-status">{{ order.status }}</span>
                                </div>
                                <div class="order-items">
                                    <div v-for="item in order.items" :key="item.id" class="order-item">
                                        <span class="item-name">{{ item.name }}</span>
                                        <span class="item-quantity">x{{ item.count }}</span>
                                        <span class="item-price">¥{{ item.price * item.count }}</span>
                                    </div>
                                </div>
                                <div class="order-footer">
                                    <span class="order-time">{{ order.time }}</span>
                                    <span class="order-total">合计：¥{{ order.total }}</span>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </el-drawer>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const drawerVisible = ref(false)
const router = useRouter()
const username = ref(localStorage.getItem('username') || '顾客')
const orderDrawerVisible = ref(false)
const audioRef = ref(null)

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
        image: '/dishes/burger.jpg',
        count: 0,
        isNew: true
    },
    {
        id: 2,
        categoryId: 1,
        name: '小狗三明治',
        description: '狗狗脸造型的三明治，搭配新鲜生菜和水果',
        price: 22,
        image: '/dishes/sandwich.jpg',
        count: 0
    },
    {
        id: 3,
        categoryId: 2,
        name: '小狗意面',
        description: '意大利面条配狗爪形状的肉丸',
        price: 26,
        image: '/dishes/pasta.jpg',
        count: 0
    },
    {
        id: 4,
        categoryId: 2,
        name: '小狗炒饭',
        description: '狗狗造型的蛋包饭，搭配特制酱料',
        price: 22,
        image: '/dishes/rice.jpg',
        count: 0
    },
    {
        id: 5,
        categoryId: 3,
        name: '小狗薯条',
        description: '香脆可口的薯条，配狗爪形状的番茄酱',
        price: 16,
        image: '/dishes/fries.jpg',
        count: 0
    },
    {
        id: 6,
        categoryId: 3,
        name: '小狗甜甜圈',
        description: '可爱的狗狗造型甜甜圈，多种口味',
        price: 18,
        image: '/dishes/donut.jpg',
        count: 0
    },
    {
        id: 7,
        categoryId: 4,
        name: '小狗奶茶',
        description: '奶茶上有可爱的狗狗拉花',
        price: 15,
        image: '/dishes/milk-tea.jpg',
        count: 0
    },
    {
        id: 8,
        categoryId: 4,
        name: '小狗果汁',
        description: '新鲜水果制作，配狗爪形状的果冻',
        price: 14,
        image: '/dishes/juice.jpg',
        count: 0
    },
    {
        id: 9,
        categoryId: 1,
        name: '小狗火锅',
        description: '狗狗造型的个人火锅，配多种新鲜食材',
        price: 58,
        image: '/dishes/hotpot.jpg',
        count: 0,
        isNew: true
    },
    {
        id: 10,
        categoryId: 1,
        name: '小狗便当',
        description: '可爱的狗狗饭团便当，营养均衡',
        price: 32,
        image: '/dishes/bento.jpg',
        count: 0,
        isNew: true
    },
    {
        id: 11,
        categoryId: 2,
        name: '小狗拉面',
        description: '热气腾腾的拉面，配狗狗造型的叉烧',
        price: 32,
        image: '/dishes/ramen.jpg',
        count: 0
    },
    {
        id: 12,
        categoryId: 2,
        name: '小狗饺子',
        description: '狗狗脸造型的可爱饺子，多种馅料',
        price: 26,
        image: '/dishes/dumplings.jpg',
        count: 0
    },
    {
        id: 13,
        categoryId: 2,
        name: '小狗披萨',
        description: '狗狗脸造型的迷你披萨，芝士满满',
        price: 36,
        image: '/dishes/pizza.jpg',
        count: 0
    },
    {
        id: 14,
        categoryId: 3,
        name: '小狗布丁',
        description: '狗狗造型的奶黄布丁，口感细腻',
        price: 16,
        image: '/dishes/pudding.jpg',
        count: 0
    },
    {
        id: 15,
        categoryId: 3,
        name: '小狗马卡龙',
        description: '狗爪形状的马卡龙，多种口味',
        price: 22,
        image: '/dishes/macaron.jpg',
        count: 0
    },
    {
        id: 16,
        categoryId: 3,
        name: '小狗曲奇',
        description: '狗狗形状的黄油曲奇，香酥可口',
        price: 18,
        image: '/dishes/cookies.jpg',
        count: 0
    },
    {
        id: 17,
        categoryId: 4,
        name: '小狗抹茶',
        description: '抹茶上有可爱的狗狗拉花，清新醇厚',
        price: 22,
        image: '/dishes/matcha.jpg',
        count: 0
    },
    {
        id: 18,
        categoryId: 4,
        name: '小狗巧克力',
        description: '热巧克力配狗爪棉花糖，甜蜜温暖',
        price: 24,
        image: '/dishes/hot-chocolate.jpg',
        count: 0
    },
    {
        id: 19,
        categoryId: 4,
        name: '小狗冰沙',
        description: '水果冰沙配狗狗造型奶油，清爽可爱',
        price: 20,
        image: '/dishes/smoothie.jpg',
        count: 0
    },
    {
        id: 20,
        categoryId: 3,
        name: '鸡爪',
        description: '你干嘛~',
        price: 2.5,
        image: '/dishes/smoothie.jpg',
        count: 0
    }
])

const currentCategory = ref(1)

const currentDishes = computed(() => {
    return dishes.value.filter(dish => dish.categoryId === currentCategory.value)
})

const addToCart = (dish) => {
    cartStore.addItem({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        count: 1
    })
    ElMessage.success('已添加到购物车')
}

const increaseCount = (item) => {
    cartStore.increaseCount(item.id)
}

const decreaseCount = (item) => {
    cartStore.decreaseCount(item.id)
}

const handleCheckout = () => {
    ElMessage.success('订单提交成功！')
    cartStore.clearCart()
    drawerVisible.value = false
}

// 模拟订单数据
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
        id: 'ORD20240229001',
        status: '已完成',
        time: '2024-02-29 18:45',
        total: 61,
        items: [
            { id: 3, name: '小狗意面', count: 1, price: 26 },
            { id: 4, name: '小狗奶茶', count: 1, price: 15 },
            { id: 5, name: '小狗甜甜圈', count: 2, price: 18 }
        ]
    }
])

const handleCommand = (command) => {
    switch (command) {
        case 'orders':
            orderDrawerVisible.value = true
            break
        case 'logout':
            localStorage.clear()
            router.push('/login')
            break
    }
}

onMounted(() => {
    // 监听用户首次点击
    document.addEventListener('click', () => {
        if (audioRef.value) {
            audioRef.value.play()
        }
    }, { once: true })
})
</script>

<style lang="scss" scoped>
.app-container {
    min-height: 100vh;
    background-color: #f5f7fa;

    .header {
        height: 64px;
        background: white;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;

            img {
                width: 40px;
                height: 40px;
            }

            span {
                font-size: 20px;
                font-weight: bold;
                color: var(--primary-color);
            }
        }

        .nav {
            display: flex;
            align-items: center;
            gap: 24px;

            .user-menu {
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
            }
        }
    }

    .main {
        padding-top: 64px;
        min-height: calc(100vh - 64px);
    }

    .menu-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;

        .categories {
            margin-bottom: 30px;
            text-align: center;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
            position: sticky;
            top: 84px;
            z-index: 10;
        }

        .dishes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 24px;
            margin-bottom: 100px;

            .dish-card {
                border-radius: var(--border-radius-medium);
                overflow: hidden;
                transition: all 0.3s;
                background: white;

                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                }

                .dish-image-container {
                    position: relative;
                    height: 180px;

                    .dish-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .dish-tag {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background-color: var(--primary-color);
                        color: white;
                        padding: 4px 8px;
                        border-radius: var(--border-radius-small);
                        font-size: 12px;
                        animation: bounce 2s infinite;
                    }
                }

                .dish-info {
                    padding: 16px;

                    h3 {
                        margin: 0 0 8px;
                        font-size: 18px;
                        color: #303133;

                        &::after {
                            content: '🐾';
                            margin-left: 8px;
                            font-size: 14px;
                        }
                    }

                    .description {
                        color: #606266;
                        font-size: 14px;
                        margin-bottom: 16px;
                        height: 40px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                    }

                    .price-action {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .price {
                            color: var(--primary-color);
                            font-size: 20px;
                            font-weight: bold;

                            &::before {
                                content: '¥';
                                font-size: 14px;
                                margin-right: 2px;
                            }
                        }
                    }
                }
            }
        }

        .cart-button {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;

            .el-button {
                padding: 12px 30px;
                font-size: 16px;
                border-radius: 30px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

                .el-icon {
                    margin-right: 8px;
                    font-size: 20px;
                }
            }
        }
    }

    .cart-drawer {
        height: 100%;
        display: flex;
        flex-direction: column;

        .cart-header {
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ebeef5;

            h3 {
                margin: 0;
                font-size: 18px;
            }
        }

        .cart-items {
            flex: 1;
            padding: 20px;
            overflow-y: auto;

            .cart-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;

                .item-info {
                    h4 {
                        margin: 0 0 4px;
                        font-size: 16px;
                    }

                    .price {
                        color: #f56c6c;
                        font-size: 16px;
                    }
                }

                .quantity-control {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    .count {
                        min-width: 30px;
                        text-align: center;
                    }
                }
            }
        }

        .cart-footer {
            padding: 20px;
            border-top: 1px solid #ebeef5;

            .total {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                font-size: 16px;

                .price {
                    color: #f56c6c;
                    font-size: 24px;
                    font-weight: bold;
                }
            }

            .el-button {
                width: 100%;
            }
        }
    }

    .order-drawer {
        height: 100%;
        display: flex;
        flex-direction: column;

        .order-header {
            padding: 20px;
            border-bottom: 1px solid #ebeef5;

            h3 {
                margin: 0;
                font-size: 18px;
                color: #303133;
            }
        }

        .order-list {
            flex: 1;
            padding: 20px;
            overflow-y: auto;

            .order-card {
                margin-bottom: 20px;

                .order-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #ebeef5;

                    .order-id {
                        color: #606266;
                        font-size: 14px;
                    }

                    .order-status {
                        color: #67c23a;
                    }
                }

                .order-items {
                    margin-bottom: 16px;

                    .order-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                        color: #606266;

                        .item-name {
                            flex: 1;
                        }

                        .item-quantity {
                            margin: 0 16px;
                            color: #909399;
                        }

                        .item-price {
                            min-width: 80px;
                            text-align: right;
                            color: #f56c6c;
                        }
                    }
                }

                .order-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 12px;
                    border-top: 1px solid #ebeef5;

                    .order-time {
                        color: #909399;
                        font-size: 14px;
                    }

                    .order-total {
                        color: #f56c6c;
                        font-size: 16px;
                        font-weight: bold;
                    }
                }
            }
        }
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}
</style>