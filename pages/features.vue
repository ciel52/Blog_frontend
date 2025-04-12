<template>
  <div class="features-page">
    <h1>特集・連載</h1>

    <div class="features-grid">
      <div class="feature-card" @click="goToFeature('new-releases')">
        <h2>新譜レビュー</h2>
        <p>最新のアルバムやシングルをレビューします</p>
      </div>

      <div class="feature-card" @click="goToFeature('artist-interviews')">
        <h2>アーティスト対談</h2>
        <p>注目のアーティストにインタビューします</p>
      </div>

      <div class="feature-card" @click="goToFeature('live-reports')">
        <h2>ライブレポート</h2>
        <p>ライブやフェスのレポートをお届けします</p>
      </div>

      <div class="feature-card" @click="goToFeature('music-scenes')">
        <h2>音楽のある風景</h2>
        <p>音楽と共にある日常の風景を切り取ります</p>
      </div>

      <div class="feature-card" @click="goToFeature('playlists')">
        <h2>プレイリスト</h2>
        <p>テーマ別のプレイリストを紹介します</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToFeature = (featureSlug) => {
  router.push(`/feature/${featureSlug}`)
}
</script>

<style scoped>
.features-page {
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h2 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>