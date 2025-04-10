<template>
  <div class="blog-container">
    <header class="header">
      <div class="header-content">
        <h1 class="site-title">音の記憶</h1>
        <nav class="navigation">
          <ul>
            <li><a href="#" class="active">トップページ</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">特集・連載</a></li>
            <li><a href="#">アーティスト</a></li>
            <li><a href="#">お知らせ</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <div class="content">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>読み込み中...</p>
      </div>

      <div v-else>
        <div class="posts-grid">
          <div v-for="post in filteredPosts" :key="post.id" class="post-item">
            <div class="category-label">{{ getCategoryLabel(post) }}</div>
            <h2 class="post-title">{{ post.song_title }}</h2>
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.posted_at) }}</span>
              <span class="post-author">{{ post.artist }}</span>
            </div>
            <div class="post-excerpt">{{ truncateText(post.body, 100) }}</div>
          </div>
        </div>

        <div class="features-section">
          <h2 class="section-title">特集・連載</h2>
          <div class="features-grid">
            <div class="feature-item">
              <h3>新譜レビュー</h3>
            </div>
            <div class="feature-item">
              <h3>アーティスト対談</h3>
            </div>
            <div class="feature-item">
              <h3>ライブレポート</h3>
            </div>
            <div class="feature-item">
              <h3>音楽のある風景</h3>
            </div>
            <div class="feature-item">
              <h3>プレイリスト</h3>
            </div>
          </div>
        </div>

        <div class="instagram-section">
          <h2 class="section-title">INSTAGRAM</h2>
          <div class="instagram-grid">
            <div class="instagram-item" v-for="post in filteredPosts.slice(0, 4)" :key="post.id">
              <div class="instagram-content">
                <h3>{{ post.artist }} - {{ post.song_title }}</h3>
                <p>{{ truncateText(post.body, 80) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <div class="social-links">
          <a href="#" class="social-link">facebook</a>
          <a href="#" class="social-link">instagram</a>
        </div>
        <div class="copyright">
          copyrights © 音の記憶
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 状態管理のためのref
const posts = ref([])
const loading = ref(true)
const searchQuery = ref('')

// 検索機能
const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(post =>
    post.artist.toLowerCase().includes(query) ||
    post.song_title.toLowerCase().includes(query) ||
    post.body.toLowerCase().includes(query)
  )
})

// 日付フォーマット関数
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

// テキスト切り詰め関数
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// カテゴリーラベル取得関数
const getCategoryLabel = (post) => {
  // ここでは単純に「音楽日記」を返しますが、実際のデータに基づいて
  // 異なるカテゴリを返すロジックを実装できます
  return '音楽日記'
}

onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/blog/posts/')
    if (response.ok) {
      const res = await response.json()
      posts.value = res
      console.log(posts.value)
    }
  } catch (error) {
    console.error('データの取得に失敗しました', error)
  } finally {
    loading.value = false
  }
})

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
  color: #333;
  line-height: 1.6;
  background-color: #fff;
}

.blog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ヘッダー */
.header {
  padding: 30px 0;
  border-bottom: 1px solid #eee;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.site-title {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.navigation ul {
  display: flex;
  list-style: none;
  gap: 20px;
}

.navigation a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  padding: 5px 0;
}

.navigation a.active, .navigation a:hover {
  border-bottom: 1px solid #333;
}

/* コンテンツ */
.content {
  padding: 40px 0;
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

/* 投稿一覧 */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.post-item {
  display: flex;
  flex-direction: column;
}

.category-label {
  font-size: 12px;
  margin-bottom: 10px;
  color: #777;
}

.post-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #777;
}

.post-excerpt {
  font-size: 14px;
  color: #555;
}

/* 特集セクション */
.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ddd;
}

.features-section {
  margin-bottom: 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.feature-item {
  padding: 15px;
  border: 1px solid #eee;
}

.feature-item h3 {
  font-size: 16px;
  font-weight: normal;
}

/* Instagramセクション */
.instagram-section {
  margin-bottom: 60px;
}

.instagram-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.instagram-item {
  border: 1px solid #eee;
  padding: 20px;
}

.instagram-content h3 {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 10px;
}

.instagram-content p {
  font-size: 14px;
  color: #555;
}

/* フッター */
.footer {
  padding: 30px 0;
  border-top: 1px solid #eee;
  margin-top: 40px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.social-links {
  display: flex;
  gap: 20px;
}

.social-link {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.copyright {
  font-size: 12px;
  color: #777;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .navigation ul {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .posts-grid, .features-grid, .instagram-grid {
    grid-template-columns: 1fr;
  }
}
</style>
