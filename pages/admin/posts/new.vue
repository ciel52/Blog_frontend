<template>
  <div class="new-post">
    <h1>新規投稿</h1>
    <form @submit.prevent="handleSubmit" class="post-form">
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
          {{ isSubmitting ? '投稿中...' : '投稿する' }}
        </button>
        <NuxtLink to="/admin/posts" class="cancel-btn">キャンセル</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlog } from '~/composables/useBlog'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const { createPost } = useBlog()

const song_title = ref('')
const artist = ref('')
const body = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    const postData = {
      song_title: song_title.value,
      artist: artist.value,
      body: body.value
    }

    await createPost(postData)
    router.push('/admin/posts')
  } catch (error) {
    console.error('投稿エラー:', error)
    alert(error instanceof Error ? error.message : '投稿の作成に失敗しました。もう一度お試しください。')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.new-post {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #1a237e;
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