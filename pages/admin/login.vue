<template>
  <div class="login-page">
    <div class="login-container">
      <h1>管理者ログイン</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">ユーザー名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="form-control"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'ログイン中...' : 'ログイン' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { login, isLoading, error } = useAuth()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await login(username.value, password.value)
    router.push('/admin')
  } catch (e) {
    // エラーはuseAuthコンポーザブルで処理されます
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #1a237e;
  margin-bottom: 2rem;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #ffebee;
  border-radius: 4px;
  font-size: 0.9rem;
}

.login-btn {
  width: 100%;
  background: #1a237e;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #0d47a1;
}

.login-btn:disabled {
  background: #9fa8da;
  cursor: not-allowed;
}
</style> 