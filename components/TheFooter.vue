<template>
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
</template>

<style scoped>
.footer {
  padding: 30px 0;
  border-top: 1px solid #eee;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  transition: color 0.2s;
}

.social-link:hover {
  color: #666;
}

.copyright {
  font-size: 12px;
  color: #777;
}
</style> 