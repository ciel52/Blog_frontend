<template>
  <div class="blog-page">
    <header class="blog-header">
      <h1>音楽ブログ</h1>
      <p class="subtitle">音楽の魅力を語るブログ</p>
    </header>

    <main class="blog-main">
      <div v-if="loading" class="loading">
        読み込み中...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else-if="posts.length === 0" class="no-posts">
        投稿がありません
      </div>

      <div v-else class="posts-grid">
        <article v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-content">
            <h2 class="post-title">{{ post.song_title }}</h2>
            <p class="post-artist">アーティスト: {{ post.artist }}</p>
            <p class="post-excerpt">{{ post.body.substring(0, 200) }}...</p>
          </div>
          <div class="post-footer">
            <NuxtLink :to="`/posts/${post.id}`" class="read-more">
              続きを読む
            </NuxtLink>
            <span class="post-date">{{ formatDate(post.posted_at) }}</span>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlog } from '~/composables/useBlog'

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
</script>

<style scoped>
.blog-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.blog-header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.5rem;
  color: #1a237e;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
}

.loading, .error, .no-posts {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #d32f2f;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-content {
  padding: 1.5rem;
}

.post-title {
  margin: 0 0 0.5rem 0;
  color: #1a237e;
  font-size: 1.5rem;
}

.post-artist {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.post-excerpt {
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.post-footer {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-more {
  color: #1a237e;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.read-more:hover {
  color: #0d47a1;
}

.post-date {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .blog-page {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>