<template>
  <div class="admin-dashboard">
    <h1>ダッシュボード</h1>
    
    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>投稿数</h3>
        <p class="stat-value">{{ posts.length }}</p>
      </div>
      <div class="stat-card">
        <h3>最新投稿</h3>
        <p class="stat-value">{{ latestPost ? formatDate(latestPost.posted_at) : 'なし' }}</p>
      </div>
    </div>
    
    <div class="recent-posts">
      <h2>最近の投稿</h2>
      <div v-if="loading" class="loading">
        読み込み中...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else-if="posts.length === 0" class="no-posts">
        投稿がありません
      </div>
      <div v-else class="posts-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>タイトル</th>
              <th>アーティスト</th>
              <th>投稿日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts.slice(0, 5)" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.song_title }}</td>
              <td>{{ post.artist }}</td>
              <td>{{ formatDate(post.posted_at) }}</td>
              <td>
                <NuxtLink :to="`/admin/posts/${post.id}/edit`" class="action-btn edit">編集</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBlog } from '~/composables/useBlog'

definePageMeta({
  layout: 'admin'
})

const { posts, loading, error, fetchPosts } = useBlog()

const latestPost = computed(() => {
  if (posts.value.length === 0) return null
  return posts.value[0]
})

onMounted(() => {
  fetchPosts()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.admin-dashboard {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

h1 {
  margin-top: 0;
  margin-bottom: 2rem;
  color: #1a237e;
  font-size: 2rem;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.stat-value {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a237e;
}

.posts-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

tr:hover {
  background-color: #f8f9fa;
}

.action-btn {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit {
  background-color: #e3f2fd;
  color: #0d47a1;
}

.edit:hover {
  background-color: #bbdefb;
}

.loading, .error, .no-posts {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  th, td {
    padding: 0.5rem;
  }
}
</style> 