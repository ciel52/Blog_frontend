<template>
  <div class="edit-post">
    <h1>投稿を編集</h1>
    <div v-if="loading" class="loading">
      読み込み中...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <form v-else @submit.prevent="handleSubmit" class="post-form">
      <div class="form-group">
        <label for="song_title">曲のタイトル</label>
        <input
          id="song_title"
          v-model="song_title"
          type="text"
          required
          class="form-control"
          placeholder="曲のタイトルを入力"
        />
      </div>
      
      <div class="form-group">
        <label for="artist">アーティスト</label>
        <input
          id="artist"
          v-model="artist"
          type="text"
          required
          class="form-control"
          placeholder="アーティスト名を入力"
        />
      </div>
      
      <div class="form-group">
        <label for="body">本文</label>
        <textarea
          id="body"
          v-model="body"
          required
          class="form-control"
          rows="10"
          placeholder="記事の本文を入力"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? '更新中...' : '更新する' }}
        </button>
        <NuxtLink to="/admin/posts" class="cancel-btn">キャンセル</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useBlog } from '~/composables/useBlog'
import { API_ENDPOINTS } from '~/constants/api'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const route = useRoute()
const { getTokens } = useAuth()
const { fetchPostById, updatePost } = useBlog()

const song_title = ref('')
const artist = ref('')
const body = ref('')
const isSubmitting = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)

const postId = route.params.id as string

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    
    const post = await fetchPostById(parseInt(postId), true)
    if (post) {
      song_title.value = post.song_title
      artist.value = post.artist
      body.value = post.body
    } else {
      error.value = '投稿が見つかりませんでした'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
    console.error('投稿取得エラー:', e)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    
    const updatedPost = await updatePost(parseInt(postId), {
      song_title: song_title.value,
      artist: artist.value,
      body: body.value
    })

    if (updatedPost) {
      router.push('/admin/posts')
    } else {
      throw new Error('投稿の更新に失敗しました')
    }
  } catch (error) {
    console.error('更新エラー:', error)
    alert('投稿の更新に失敗しました。もう一度お試しください。')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.edit-post {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #1a237e;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #d32f2f;
}

.post-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

textarea.form-control {
  resize: vertical;
  min-height: 200px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn {
  background: #1a237e;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background: #0d47a1;
}

.submit-btn:disabled {
  background: #9fa8da;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f5f5f5;
  color: #333;
}
</style> 