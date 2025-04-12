<template>
  <div class="news-page">
    <h1>お知らせ</h1>

    <div class="news-list">
      <div v-for="news in newsItems" :key="news.id" class="news-item">
        <div class="news-date">{{ formatDate(news.date) }}</div>
        <div class="news-content">
          <h2>{{ news.title }}</h2>
          <p>{{ news.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// お知らせデータ
const newsItems = ref([
  {
    id: 1,
    date: '2025-04-10',
    title: 'サイトリニューアルのお知らせ',
    content: '音の記憶のサイトデザインをリニューアルしました。より使いやすく、見やすいデザインになりました。'
  },
  {
    id: 2,
    date: '2025-04-05',
    title: '新機能追加のお知らせ',
    content: 'アーティスト検索機能を追加しました。お気に入りのアーティストを簡単に見つけることができます。'
  },
  {
    id: 3,
    date: '2025-04-01',
    title: 'メンテナンスのお知らせ',
    content: '4月15日にシステムメンテナンスを実施します。ご不便をおかけしますが、ご理解ください。'
  }
])

// 日付フォーマット関数
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.news-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 40px;
  text-align: center;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.news-item {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  display: flex;
  gap: 30px;
}

.news-date {
  font-size: 14px;
  color: #777;
  white-space: nowrap;
}

.news-content {
  flex-grow: 1;
}

.news-content h2 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}

.news-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}

@media (max-width: 768px) {
  .news-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .news-date {
    font-size: 12px;
  }
}
</style> 