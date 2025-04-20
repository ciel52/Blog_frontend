<template>
  <div class="admin-dashboard">
    <h1>管理者ダッシュボード</h1>
    
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h2>投稿管理</h2>
        <p>ブログ記事の作成、編集、削除を行います。</p>
        <NuxtLink to="/admin/posts/new" class="card-btn">新規投稿</NuxtLink>
      </div>
      
      <div class="dashboard-card">
        <h2>投稿一覧</h2>
        <p>既存の投稿を確認、編集、削除します。</p>
        <NuxtLink to="/admin/posts" class="card-btn">投稿一覧へ</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #1a237e;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

p {
  margin-bottom: 1.5rem;
  color: #666;
}

.card-btn {
  display: inline-block;
  background: #1a237e;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.card-btn:hover {
  background: #0d47a1;
}
</style> 