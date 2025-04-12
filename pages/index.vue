<template>
  <div class="home">
    <section class="hero">
      <h1>音楽ブログ</h1>
      <p>音楽を通じて、あなたの記憶を共有しましょう</p>
    </section>

    <section class="posts">
      <h2>最新の記事</h2>
      <div v-if="loading" class="loading">
        読み込み中...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else class="posts-grid">
        <article v-for="post in posts" :key="post.id" class="post-card">
          <h3>{{ post.song_title }}</h3>
          <p class="post-artist">{{ post.artist }}</p>
          <p class="post-date">{{ formatDate(post.posted_at) }}</p>
          <p class="post-excerpt">{{ truncateContent(post.body) }}</p>
          <NuxtLink :to="`/posts/${post.id}`" class="read-more">
            続きを読む
          </NuxtLink>
        </article>
      </div>
    </section>
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

const truncateContent = (content: string) => {
  return content.length > 150 ? content.slice(0, 150) + '...' : content
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.hero {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-radius: 12px;
  margin-bottom: 3rem;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.hero h1 {
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero p {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.9);
}

.posts h2 {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.posts h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  border-radius: 2px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.post-card {
  background: white;
  border-radius: 12px;
  padding: 1.8rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.post-card:hover::before {
  opacity: 1;
}

.post-card h3 {
  font-size: 1.6rem;
  color: #222;
  margin-bottom: 0.6rem;
  line-height: 1.3;
}

.post-artist {
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 0.6rem;
  font-weight: 500;
}

.post-date {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1.2rem;
}

.post-excerpt {
  color: #444;
  line-height: 1.7;
  margin-bottom: 1.8rem;
  font-size: 1rem;
}

.read-more {
  display: inline-block;
  color: #2575fc;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  position: relative;
}

.read-more::after {
  content: '→';
  margin-left: 5px;
  transition: transform 0.2s ease;
}

.read-more:hover {
  color: #6a11cb;
}

.read-more:hover::after {
  transform: translateX(5px);
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.error {
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.2);
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }
  
  .hero {
    padding: 3rem 1rem;
  }
  
  .hero h1 {
    font-size: 2.2rem;
  }
  
  .hero p {
    font-size: 1.1rem;
  }
  
  .posts h2 {
    font-size: 1.8rem;
  }
  
  .post-card {
    padding: 1.5rem;
  }
}
</style>