<template>
  <div class="post-form">
    <h1>投稿を編集</h1>
    
    <div v-if="loading" class="loading">
      読み込み中...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="!currentPost" class="not-found">
      投稿が見つかりませんでした
    </div>
    <form v-else @submit.prevent="updatePost" class="form">
      <div class="form-group">
        <label for="song_title">曲のタイトル</label>
        <input 
          id="song_title" 
          v-model="formData.song_title" 
          type="text" 
          required
          placeholder="曲のタイトルを入力"
        />
      </div>
      
      <div class="form-group">
        <label for="artist">アーティスト</label>
        <input 
          id="artist" 
          v-model="formData.artist" 
          type="text" 
          required
          placeholder="アーティスト名を入力"
        />
      </div>
      
      <div class="form-group">
        <label for="body">本文</label>
        <textarea 
          id="body" 
          v-model="formData.body" 
          rows="10" 
          required
          placeholder="記事の本文を入力"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="goBack" class="btn cancel">キャンセル</button>
        <button type="submit" class="btn submit" :disabled="submitting">
          {{ submitting ? '更新中...' : '更新する' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlog } from '~/composables/useBlog'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { currentPost, loading, error, fetchPostById } = useBlog()
const submitting = ref(false)

const postId = computed(() => {
  const id = route.params.id
  if (typeof id === 'string') {
    return parseInt(id, 10)
  }
  return 0
})

const formData = ref({
  song_title: '',
  artist: '',
  body: ''
})

// 現在の投稿データが変更されたら、フォームデータを更新
watch(currentPost, (newPost) => {
  if (newPost) {
    formData.value = {
      song_title: newPost.song_title,
      artist: newPost.artist,
      body: newPost.body
    }
  }
}, { immediate: true })

onMounted(() => {
  if (postId.value > 0) {
    fetchPostById(postId.value)
  }
})

const updatePost = async () => {
  submitting.value = true
  
  try {
    const response = await fetch(`http://127.0.0.1:8000/blog/posts/${postId.value}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value)
    })
    
    if (!response.ok) {
      throw new Error('投稿の更新に失敗しました')
    }
    
    // 更新成功後、投稿一覧ページに遷移
    router.push('/admin/posts')
  } catch (e) {
    alert(e instanceof Error ? e.message : '予期せぬエラーが発生しました')
    submitting.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.post-form {
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

input, textarea {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #1a237e;
  box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
}

textarea {
  resize: vertical;
  min-height: 150px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 1rem;
}

.submit {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
}

.submit:hover:not(:disabled) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ced4da;
}

.cancel:hover {
  background-color: #e9ecef;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

@media (max-width: 768px) {
  .post-form {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 