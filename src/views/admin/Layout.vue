<template>
    <div class="admin-layout">
        <el-container>
            <el-aside width="200px">
                <div class="logo">
                    <img src="../../assets/images/logo.png" alt="Logo">
                    <span>后台管理</span>
                </div>
                <el-menu router :default-active="$route.path" class="admin-menu">
                    <el-menu-item index="/admin/dishes">
                        <el-icon>
                            <Food />
                        </el-icon>
                        <span>菜品管理</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/orders">
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>订单管理</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="header-right">
                        <el-dropdown @command="handleCommand">
                            <span class="user-menu">
                                管理员
                                <el-icon>
                                    <ArrowDown />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleCommand = (command) => {
    if (command === 'logout') {
        localStorage.clear()
        router.push('/login')
    }
}
</script>

<style lang="scss" scoped>
.admin-layout {
    min-height: 100vh;

    .el-container {
        height: 100vh;
    }

    .el-aside {
        background-color: var(--primary-color);
        color: white;
        border-radius: 0 var(--border-radius-large) var(--border-radius-large) 0;
        box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);

        .logo {
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            gap: 10px;

            img {
                width: 30px;
                height: 30px;
                animation: bounce 2s infinite;
            }

            span {
                color: white;
                font-size: 16px;
                font-weight: bold;
            }
        }

        .admin-menu {
            border-right: none;
            background-color: transparent;

            .el-menu-item {
                border-radius: var(--border-radius-small);
                margin: 4px 10px;

                &:hover,
                &.is-active {
                    background-color: rgba(255, 255, 255, 0.2);
                }
            }
        }
    }

    .el-header {
        background-color: white;
        border-bottom: 1px solid #dcdfe6;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 20px;

        .user-menu {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }

    .el-main {
        background-color: #f0f2f5;
        padding: 20px;
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