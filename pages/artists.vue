<template>
  <div class="artists-page">
    <h1>アーティスト</h1>

    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="アーティストを検索..."
        @input="filterArtists"
      />
    </div>

    <div class="artists-grid">
      <div
        v-for="artist in filteredArtists"
        :key="artist.id"
        class="artist-card"
        @click="goToArtist(artist.id)"
      >
        <div class="artist-image">
          <!-- アーティスト画像があれば表示 -->
          <img v-if="artist.image" :src="artist.image" :alt="artist.name" />
          <div v-else class="placeholder-image">
            {{ getInitials(artist.name) }}
          </div>
        </div>
        <div class="artist-info">
          <h2>{{ artist.name }}</h2>
          <p>{{ artist.genre }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const artists = ref([
  { id: 1, name: '緑黄色社会', genre: 'ロック' },
  { id: 2, name: 'one ok rock', genre: 'ロック' },
  { id: 3, name: 'a', genre: 'ポップス' },
  // 他のアーティストデータ
])

// アーティスト名の頭文字を取得する関数
const getInitials = (name) => {
  return name.charAt(0)
}

// アーティストを検索でフィルタリング
const filteredArtists = computed(() => {
  if (!searchQuery.value) return artists.value
  const query = searchQuery.value.toLowerCase()
  return artists.value.filter(artist =>
    artist.name.toLowerCase().includes(query) ||
    artist.genre.toLowerCase().includes(query)
  )
})

// アーティスト詳細ページに移動
const goToArtist = (artistId) => {
  router.push(`/artist/${artistId}`)
}
</script>

<style scoped>
.artists-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 40px;
  text-align: center;
}

.search-bar {
  margin-bottom: 30px;
}

.search-bar input {
  width: 100%;
  max-width: 500px;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.search-bar input:focus {
  border-color: #333;
}

.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.artist-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.artist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.artist-image {
  width: 100%;
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.artist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #999;
  background-color: #f5f5f5;
}

.artist-info {
  padding: 20px;
}

.artist-info h2 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.artist-info p {
  font-size: 14px;
  color: #777;
}

@media (max-width: 768px) {
  .artists-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style> 