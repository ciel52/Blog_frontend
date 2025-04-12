import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const login = async (username: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('http://127.0.0.1:8000/blog/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error('ログインに失敗しました')
      }

      const data = await response.json()
      localStorage.setItem('adminToken', data.token)
      isAuthenticated.value = true
      router.push('/admin')
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    isAuthenticated.value = false
    router.push('/admin/login')
  }

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    isAuthenticated.value = !!token
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