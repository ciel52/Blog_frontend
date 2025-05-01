// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      authLoginPath: process.env.NUXT_PUBLIC_AUTH_LOGIN_PATH,
      authRefreshPath: process.env.NUXT_PUBLIC_AUTH_REFRESH_PATH,
      authVerifyPath: process.env.NUXT_PUBLIC_AUTH_VERIFY_PATH,
      blogPostsPath: process.env.NUXT_PUBLIC_BLOG_POSTS_PATH,
      blogAdminPostsPath: process.env.NUXT_PUBLIC_BLOG_ADMIN_POSTS_PATH,
    }
  }
})

