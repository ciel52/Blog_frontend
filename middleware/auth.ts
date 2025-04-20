import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  // 管理者用ルートのチェック
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const { checkAuth } = useAuth()
    
    // 認証されていない場合はログインページにリダイレクト
    if (!checkAuth()) {
      return navigateTo('/admin/login')
    }
  }
}) 