<template>
  <div class="post-detail">
    <div v-if="loading" class="loading">
      読み込み中...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="currentPost" class="post-content">
      <div class="post-header">
        <!--div class="category-label">{{ currentPost.category }}</div-->
        <h1 class="post-title">{{ currentPost.song_title }}</h1>
        <p class="post-artist">{{ currentPost.artist }}</p>
        <p class="post-date">{{ formatDate(currentPost.posted_at) }}</p>
      </div>

      <div class="post-body">
        <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
      </div>

      <div class="post-footer">
        <NuxtLink to="/" class="back-link">
          <span class="back-arrow">←</span> トップページに戻る
        </NuxtLink>
      </div>
    </div>
    <div v-else class="not-found">
      記事が見つかりませんでした
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlog } from '~/composables/useBlog'

const route = useRoute()
const { currentPost, loading, error, fetchPostById } = useBlog()

const postId = computed(() => {
  const id = route.params.id
  if (typeof id === 'string') {
    return parseInt(id, 10)
  }
  return 0
})

onMounted(() => {
  if (postId.value > 0) {
    fetchPostById(postId.value)
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const paragraphs = computed(() => {
  if (!currentPost.value) return []
  return currentPost.value.body.split('\n').filter(p => p.trim() !== '')
})
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;
}

.error {
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.2);
}

.post-content {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.post-header {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.category-label {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-bottom: 1.2rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-size: 2.5rem;
  color: #222;
  margin-bottom: 0.8rem;
  line-height: 1.3;
}

.post-artist {
  font-size: 1.4rem;
  color: #555;
  margin-bottom: 0.8rem;
  font-weight: 500;
}

.post-date {
  color: #777;
  font-size: 1rem;
}

.post-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.post-body p {
  margin-bottom: 1.5rem;
}

.post-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #2575fc;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.back-arrow {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.back-link:hover {
  color: #6a11cb;
}

@media (max-width: 768px) {
  .post-detail {
    padding: 1rem;
  }

  .post-content {
    padding: 1.5rem;
  }

  .post-title {
    font-size: 2rem;
  }

  .post-artist {
    font-size: 1.2rem;
  }

  .post-body {
    font-size: 1rem;
  }
}
</style>