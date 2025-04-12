<template>
  <header class="header">
    <div class="header-content">
      <h1 class="site-title">音楽ブログ</h1>
      <nav class="navigation">
        <ul>
          <li><NuxtLink to="/" :class="{ active: isActive('/') }">トップページ</NuxtLink></li>
          <li><NuxtLink to="/about" :class="{ active: isActive('/about') }">About</NuxtLink></li>
          <li><NuxtLink to="/features" :class="{ active: isActive('/features') }">特集・連載</NuxtLink></li>
          <li><NuxtLink to="/artists" :class="{ active: isActive('/artists') }">アーティスト</NuxtLink></li>
          <li><NuxtLink to="/news" :class="{ active: isActive('/news') }">お知らせ</NuxtLink></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.header {
  padding: 30px 0;
  border-bottom: 1px solid #eee;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.site-title {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.navigation ul {
  display: flex;
  list-style: none;
  gap: 20px;
}

.navigation a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  padding: 5px 0;
  transition: border-color 0.2s;
}

.navigation a.active, .navigation a:hover {
  border-bottom: 1px solid #333;
}

@media (max-width: 768px) {
  .navigation ul {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style> 