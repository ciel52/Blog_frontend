import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from './useApi'

export const useAuth = () => {
  const router = useRouter()
  const { endpoints } = useApi()
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getTokens = (): { access: string; refresh: string } | null => {
    const tokens = localStorage.getItem('auth_tokens')
    if (!tokens) return null

    try {
      const parsedTokens = JSON.parse(tokens)
      return parsedTokens.access && parsedTokens.refresh ? parsedTokens : null
    } catch {
      return null
    }
  }

  const setTokens = (tokens: { access: string; refresh: string }) => {
    if (!tokens.access || !tokens.refresh) {
      throw new Error('トークンの形式が不正です')
    }
    localStorage.setItem('auth_tokens', JSON.stringify(tokens))
    isAuthenticated.value = true
  }

  const removeTokens = () => {
    localStorage.removeItem('auth_tokens')
    isAuthenticated.value = false
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
      setTokens({
        access: tokens.access.trim(),
        refresh: tokens.refresh.trim()
      })
      return tokens
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    removeTokens()
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
    } catch {
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