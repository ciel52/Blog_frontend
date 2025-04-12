<template>
  <div class="post-detail">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>読み込み中...</p>
    </div>

    <div v-else-if="post" class="post-content">
      <div class="post-header">
        <div class="category-label">{{ getCategoryLabel(post) }}</div>
        <h1 class="post-title">{{ post.song_title }}</h1>
        <div class="post-meta">
          <span class="post-date">{{ formatDate(post.posted_at) }}</span>
          <span class="post-author">{{ post.artist }}</span>
        </div>
      </div>

      <div class="post-body">
        {{ post.body }}
      </div>

      <div class="post-footer">
        <button class="back-button" @click="goBack">← 戻る</button>
      </div>
    </div>

    <div v-else class="error">
      <p>投稿が見つかりませんでした</p>
      <button class="back-button" @click="goBack">← 戻る</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const post = ref(null)
const loading = ref(true)

// 日付フォーマット関数
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

// カテゴリーラベル取得関数
const getCategoryLabel = (post) => {
  return '音楽日記'
}

// 戻るボタンの処理
const goBack = () => {
  router.back()
}

onMounted(async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/blog/posts/${route.params.id}/`)
    if (response.ok) {
      const res = await response.json()
      post.value = res
    }
  } catch (error) {
    console.error('データの取得に失敗しました', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.spinner {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 2px solid #333;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.post-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.post-header {
  padding: 40px;
  border-bottom: 1px solid #eee;
}

.category-label {
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
}

.post-title {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 20px;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #777;
}

.post-body {
  padding: 40px;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.post-footer {
  padding: 20px 40px;
  border-top: 1px solid #eee;
}

.back-button {
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #f5f5f5;
}

.error {
  text-align: center;
  padding: 40px;
}

.error p {
  margin-bottom: 20px;
  color: #777;
}
</style> 