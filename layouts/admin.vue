<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="admin-header-content">
        <h1 class="admin-title">ブログ管理画面</h1>
        <nav class="admin-nav">
          <NuxtLink to="/admin" class="nav-link">ダッシュボード</NuxtLink>
          <NuxtLink to="/admin/posts" class="nav-link">投稿一覧</NuxtLink>
          <NuxtLink to="/admin/posts/new" class="nav-link">新規投稿</NuxtLink>
          <NuxtLink to="/" class="nav-link">サイト表示</NuxtLink>
        </nav>
        <button @click="handleLogout" class="logout-btn">ログアウト</button>
      </div>
    </header>

    <main class="admin-main">
      <slot />
    </main>

    <footer class="admin-footer">
      <p>&copy; 2025 音楽ブログ 管理画面</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-header {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.admin-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: white;
  transition: width 0.2s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.admin-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
}

.admin-footer {
  background-color: #e9ecef;
  padding: 1rem 0;
  text-align: center;
  color: #495057;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .admin-header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .admin-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style> 