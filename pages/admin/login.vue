<template>
  <div class="login-page">
    <div class="login-form">
      <h1>管理者ログイン</h1>

      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label for="username">ユーザー名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="ユーザー名を入力"
          />
        </div>

        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="パスワードを入力"
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
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'auth'
})

const username = ref('')
const password = ref('')
const { login, isLoading, error } = useAuth()

const handleLogin = async () => {
  try {
    await login(username.value, password.value)
    // ログイン成功時に管理者ページにリダイレクト
    navigateTo('/admin/posts')
  } catch (e) {
    console.error('ログインエラー:', e)
  }
}
</script>

<style scoped>
.login-page {
  width: 100%;
  max-width: 400px;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

h1 {
  margin: 0 0 2rem 0;
  color: #1a237e;
  text-align: center;
  font-size: 1.8rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #333;
}

input {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #1a237e;
  box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
}

.error-message {
  color: #dc3545;
  text-align: center;
  font-size: 0.9rem;
}

.login-btn {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>