<template>
  <div class="posts-page">
    <div class="page-header">
      <h1>投稿一覧</h1>
      <NuxtLink to="/admin/posts/new" class="new-post-btn">新規投稿</NuxtLink>
    </div>

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
            <th>曲のタイトル</th>
            <th>アーティスト</th>
            <th>投稿日</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>{{ post.id }}</td>
            <td>{{ post.song_title }}</td>
            <td>{{ post.artist }}</td>
            <td>{{ formatDate(post.posted_at) }}</td>
            <td class="actions">
              <NuxtLink :to="`/admin/posts/${post.id}/edit`" class="action-btn edit">編集</NuxtLink>
              <button @click="deletePost(post.id)" class="action-btn delete">削除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlog } from '~/composables/useBlog'
import { useAuth } from '~/composables/useAuth'
import { API_ENDPOINTS } from '~/constants/api'

definePageMeta({
  layout: 'admin'
})

const { posts, loading, error, fetchPosts } = useBlog()
const { getToken } = useAuth()

onMounted(() => {
  fetchPosts(true)
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const deletePost = async (id: number) => {
  if (!confirm('この投稿を削除してもよろしいですか？')) {
    return
  }
  
  try {
    const token = getToken()
    const response = await fetch(API_ENDPOINTS.ADMIN.POST_DETAIL(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('投稿の削除に失敗しました')
    }
    
    // 投稿一覧を再取得
    fetchPosts(true)
  } catch (error) {
    console.error('削除エラー:', error)
    alert('投稿の削除に失敗しました。もう一度お試しください。')
  }
}
</script>

<style scoped>
.posts-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  color: #1a237e;
}

.new-post-btn {
  background: #1a237e;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.new-post-btn:hover {
  background: #0d47a1;
}

.loading, .error, .no-posts {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #d32f2f;
}

.posts-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

tr:hover {
  background-color: #f8f9fa;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.edit {
  background-color: #e3f2fd;
  color: #0d47a1;
  border: none;
}

.edit:hover {
  background-color: #bbdefb;
}

.delete {
  background-color: #ffebee;
  color: #d32f2f;
  border: none;
}

.delete:hover {
  background-color: #ffcdd2;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  th, td {
    padding: 0.75rem 0.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style> 