import { ref } from 'vue'  //すぐに変更できるように
import { useApi } from './useApi'
import { useAuth } from './useAuth'
import { useRouter } from 'vue-router'

export interface BlogPost {
  id: number
  artist: string
  slug: string
  song_title: string
  posted_at: string
  body: string
}

export const useBlog = () => {
  const { endpoints } = useApi()
  const { getTokens } = useAuth()
  const router = useRouter()
  const posts = ref<BlogPost[]>([])
  const currentPost = ref<BlogPost | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const handleAuthError = () => {
    router.push('/admin/login')
  }

  const fetchPosts = async (isAdmin = false) => {
    loading.value = true
    error.value = null

    try {
      const endpoint = isAdmin ? endpoints.admin.posts() : endpoints.user.posts()

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }

      // 管理者画面の場合のみ認証トークンを追加
      if (isAdmin) {
        const tokens = getTokens()
        if (!tokens?.access) {
          handleAuthError()
          throw new Error('管理者画面にアクセスするにはログインが必要です。')
        }
        headers['Authorization'] = `Bearer ${tokens.access}`
      }

      const response = await fetch(endpoint, {
        headers,
        mode: 'cors'
      })

      if (!response.ok) {
        if (response.status === 401 && isAdmin) {
          handleAuthError()
          throw new Error('管理者権限がありません。ログインし直してください。')
        }
        throw new Error(`投稿の取得に失敗しました (${response.status})`)
      }

      const data = await response.json()
      posts.value = Array.isArray(data) ? data : data.results || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchPostById = async (id: number, isAdmin = false): Promise<BlogPost | null> => {
    loading.value = true
    error.value = null

    try {
      const endpoint = isAdmin ? endpoints.admin.postDetail(id) : endpoints.user.postDetail(id)

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }

      // 管理者画面の場合のみ認証トークンを追加
      if (isAdmin) {
        const tokens = getTokens()
        if (!tokens?.access) {
          handleAuthError()
          throw new Error('管理者画面にアクセスするにはログインが必要です。')
        }
        headers['Authorization'] = `Bearer ${tokens.access}`
      }

      const response = await fetch(endpoint, {
        headers,
        mode: 'cors'
      })

      if (!response.ok) {
        if (response.status === 404) {
          currentPost.value = null
          return null
        }
        if (response.status === 401 && isAdmin) {
          handleAuthError()
          throw new Error('管理者権限がありません。ログインし直してください。')
        }
        throw new Error(`投稿の取得に失敗しました (${response.status})`)
      }

      const data = await response.json()
      currentPost.value = data
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createPost = async (postData: Omit<BlogPost, 'id' | 'slug' | 'posted_at'>): Promise<BlogPost | null> => {
    loading.value = true
    error.value = null

    try {
      const tokens = getTokens()
      if (!tokens?.access) {
        handleAuthError()
        throw new Error('管理者画面にアクセスするにはログインが必要です。')
      }

      const accessToken = tokens.access.trim()
      if (typeof accessToken !== 'string') {
        handleAuthError()
        throw new Error('トークンが無効です。ログインし直してください。')
      }

      // トークンの検証
      const verifyResponse = await fetch(endpoints.auth.verify(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ token: accessToken })
      })

      if (!verifyResponse.ok) {
        handleAuthError()
        throw new Error('トークンが無効です。ログインし直してください。')
      }

      const response = await fetch(endpoints.admin.posts(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('エラーレスポンス:', errorData)

        if (response.status === 401) {
          handleAuthError()
          throw new Error('管理者権限がありません。ログインし直してください。')
        }
        throw new Error(`投稿の作成に失敗しました (${response.status})`)
      }

      const data = await response.json()
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updatePost = async (id: number, postData: Partial<BlogPost>): Promise<BlogPost | null> => {
    loading.value = true
    error.value = null

    try {
      const tokens = getTokens()
      if (!tokens?.access) {
        handleAuthError()
        throw new Error('管理者画面にアクセスするにはログインが必要です。')
      }

      const accessToken = tokens.access.trim()
      if (typeof accessToken !== 'string') {
        handleAuthError()
        throw new Error('トークンが無効です。ログインし直してください。')
      }

      // トークンの検証
      const verifyResponse = await fetch(endpoints.auth.verify(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ token: accessToken })
      })

      if (!verifyResponse.ok) {
        handleAuthError()
        throw new Error('トークンが無効です。ログインし直してください。')
      }

      const response = await fetch(endpoints.admin.postDetail(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('エラーレスポンス:', errorData)

        if (response.status === 401) {
          handleAuthError()
          throw new Error('管理者権限がありません。ログインし直してください。')
        }
        throw new Error(`投稿の更新に失敗しました (${response.status})`)
      }

      const data = await response.json()
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deletePost = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const tokens = getTokens()
      if (!tokens?.access) {
        handleAuthError()
        throw new Error('管理者画面にアクセスするにはログインが必要です。')
      }

      const accessToken = tokens.access.trim()
      if (typeof accessToken !== 'string') {
        handleAuthError()
        throw new Error('トークンが無効です。ログインし直してください。')
      }

      const response = await fetch(endpoints.admin.postDetail(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError()
          throw new Error('管理者権限がありません。ログインし直してください。')
        }
        throw new Error(`投稿の削除に失敗しました (${response.status})`)
      }

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      throw e
    } finally {
      loading.value = false
    }
  }

  const checkAdminAuth = async (): Promise<boolean> => {
    const tokens = getTokens()
    if (!tokens?.access) {
      handleAuthError()
      return false
    }

    const accessToken = tokens.access.trim()
    if (typeof accessToken !== 'string') {
      handleAuthError()
      return false
    }

    try {
      const response = await fetch(endpoints.admin.posts(), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        mode: 'cors'
      })

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError()
          return false
        }
        throw new Error(`認証チェックに失敗しました (${response.status})`)
      }

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      return false
    }
  }

  return {
    posts,
    currentPost,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    checkAdminAuth
  }
}