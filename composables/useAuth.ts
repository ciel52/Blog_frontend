import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from './useApi'
import { API_ENDPOINTS } from '~/constants/api'

interface AuthTokens {
  access: string;
  refresh: string;
}

export const useAuth = () => {
  const router = useRouter()
  const { endpoints } = useApi()
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getTokens = (): { access: string; refresh: string } | null => {
    try {
      const tokens = localStorage.getItem('auth_tokens')
      if (!tokens) return null
      
      const parsedTokens = JSON.parse(tokens)
      if (!parsedTokens.access || !parsedTokens.refresh) {
        console.error('トークンの形式が不正です:', parsedTokens)
        return null
      }
      
      return parsedTokens
    } catch (e) {
      console.error('トークンの取得に失敗しました:', e)
      return null
    }
  }

  const setTokens = (tokens: { access: string; refresh: string }) => {
    try {
      if (!tokens.access || !tokens.refresh) {
        throw new Error('トークンの形式が不正です')
      }
      
      localStorage.setItem('auth_tokens', JSON.stringify(tokens))
      isAuthenticated.value = true
    } catch (e) {
      console.error('トークンの保存に失敗しました:', e)
      throw e
    }
  }

  const removeTokens = () => {
    try {
      localStorage.removeItem('auth_tokens')
      isAuthenticated.value = false
    } catch (e) {
      console.error('トークンの削除に失敗しました:', e)
      throw e
    }
  }

  const login = async (username: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(endpoints.auth.login(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'ログインに失敗しました')
      }

      const tokens = await response.json()
      console.log('ログイン成功、トークン:', tokens)
      
      if (!tokens.access || !tokens.refresh) {
        throw new Error('トークンの形式が不正です')
      }

      // トークンの前後の空白を削除
      tokens.access = tokens.access.trim()
      tokens.refresh = tokens.refresh.trim()
      
      setTokens(tokens)
      isAuthenticated.value = true
      return tokens
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      console.error('ログインエラー:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    removeTokens()
    isAuthenticated.value = false
    router.push('/admin/login')
  }

  const checkAuth = async () => {
    const tokens = getTokens()
    if (!tokens) {
      isAuthenticated.value = false
      router.push('/admin/login')
      return false
    }

    try {
      const response = await fetch(endpoints.auth.verify(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ token: tokens.access })
      })

      if (!response.ok) {
        // トークンが無効な場合、リフレッシュトークンで新しいトークンを取得
        const refreshResponse = await fetch(endpoints.auth.refresh(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ refresh: tokens.refresh })
        })

        if (!refreshResponse.ok) {
          isAuthenticated.value = false
          router.push('/admin/login')
          return false
        }

        const newTokens = await refreshResponse.json()
        setTokens(newTokens)
      }

      isAuthenticated.value = true
      return true
    } catch (e) {
      console.error('認証チェックエラー:', e)
      isAuthenticated.value = false
      router.push('/admin/login')
      return false
    }
  }

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    getTokens
  }
}