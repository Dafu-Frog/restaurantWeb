<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="../assets/images/logo.png" alt="Puppy Restaurant Logo">
        <h2>小狗餐厅</h2>
      </div>
      <div class="login-form">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock"
              @keyup.enter="handleLogin" />
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="loginForm.role">
              <el-radio label="customer">顾客</el-radio>
              <el-radio label="admin">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" class="login-button">
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  role: 'customer'
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟登录验证
        await new Promise(resolve => setTimeout(resolve, 1000))

        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', loginForm.role)
        localStorage.setItem('username', loginForm.username)

        ElMessage.success('登录成功')

        if (loginForm.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/home')
        }
      } catch (error) {
        ElMessage.error('登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);

  .login-box {
    width: 400px;
    padding: 40px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

    .login-header {
      text-align: center;
      margin-bottom: 40px;

      img {
        width: 80px;
        height: 80px;
        margin-bottom: 16px;
      }

      h2 {
        color: var(--primary-color);
        font-size: 28px;
        margin: 0;
      }
    }

    .login-form {
      .el-form-item {
        margin-bottom: 24px;
      }

      .login-button {
        width: 100%;
        padding: 12px;
        font-size: 16px;
      }
    }
  }
}
</style>