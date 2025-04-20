import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_ENDPOINTS } from '~/constants/api'

interface AuthTokens {
  token: string;
}

export const useAuth = () => {
  const router = useRouter()
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getToken = () => {
    const tokens = localStorage.getItem('auth_tokens')
    if (!tokens) return null
    return JSON.parse(tokens).token
  }

  const login = async (username: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      // CSRFトークンを取得
      await fetch(`${API_ENDPOINTS.AUTH.LOGIN().replace('/api/token/', '/api/csrf-token/')}`, {
        method: 'GET',
        credentials: 'include'
      })

      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()
      console.log('ログインレスポンス:', data)

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'ログインに失敗しました')
      }

      if (!data.token) {
        throw new Error('認証トークンが取得できませんでした')
      }

      const tokens: AuthTokens = {
        token: data.token
      }

      console.log('保存するトークン:', tokens)
      localStorage.setItem('auth_tokens', JSON.stringify(tokens))
      isAuthenticated.value = true
      router.push('/admin')
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      console.error('ログインエラー:', e)
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_tokens')
    isAuthenticated.value = false
    router.push('/admin/login')
  }

  const checkAuth = () => {
    const tokens = localStorage.getItem('auth_tokens')
    isAuthenticated.value = !!tokens
    return isAuthenticated.value
  }

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    getToken
  }
}