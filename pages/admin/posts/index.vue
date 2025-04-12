<template>
  <div class="admin-posts">
    <div class="posts-header">
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
            <th>タイトル</th>
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

definePageMeta({
  layout: 'admin'
})

const { posts, loading, error, fetchPosts } = useBlog()

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

const deletePost = async (id: number) => {
  if (!confirm('この投稿を削除してもよろしいですか？')) return
  
  try {
    const response = await fetch(`http://127.0.0.1:8000/blog/posts/${id}/`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('投稿の削除に失敗しました')
    }
    
    // 削除成功後、投稿一覧を再取得
    fetchPosts()
  } catch (e) {
    alert(e instanceof Error ? e.message : '予期せぬエラーが発生しました')
  }
}
</script>

<style scoped>
.admin-posts {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  color: #1a237e;
  font-size: 2rem;
}

.new-post-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.new-post-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.posts-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
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

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.edit {
  background-color: #e3f2fd;
  color: #0d47a1;
}

.edit:hover {
  background-color: #bbdefb;
}

.delete {
  background-color: #ffebee;
  color: #c62828;
}

.delete:hover {
  background-color: #ffcdd2;
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
  .admin-posts {
    padding: 1rem;
  }
  
  .posts-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  th, td {
    padding: 0.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style> 