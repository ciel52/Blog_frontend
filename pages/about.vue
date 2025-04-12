<template>
  <div class="about-page">
    <div class="about-content">
      <h1>About</h1>

      <section class="about-section">
        <h2>音の記憶について</h2>
        <p>
          「音の記憶」は、音楽を通じて私たちの生活や思い出を記録するブログです。
          日々の生活の中で出会う音楽、心に響く曲、思い出の歌など、
          音楽が持つ特別な力を共有する場所として運営しています。
        </p>
      </section>

      <section class="about-section">
        <h2>ブログの目的</h2>
        <ul>
          <li>音楽を通じた思い出の共有</li>
          <li>新しい音楽との出会いの場の提供</li>
          <li>音楽を通じたコミュニケーションの促進</li>
          <li>音楽文化の発信と保存</li>
        </ul>
      </section>

      <section class="about-section">
        <h2>お問い合わせ</h2>
        <p>
          ご質問やご意見がございましたら、以下のメールアドレスまでお気軽にお問い合わせください。
        </p>
        <p class="contact-email">
          contact@otono-kioku.com
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
// Aboutページのスクリプト
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.about-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 40px;
}

h1 {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 40px;
  text-align: center;
}

.about-section {
  margin-bottom: 40px;
}

h2 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #333;
}

p {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
  margin-bottom: 20px;
}

li {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 10px;
}

.contact-email {
  font-size: 18px;
  color: #333;
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
}
</style>