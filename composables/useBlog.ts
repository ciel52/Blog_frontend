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

  const getAuthHeaders = (isAdmin: boolean): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }

    if (isAdmin) {
      const tokens = getTokens()
      if (!tokens?.access) {
        handleAuthError()
        throw new Error('管理者画面にアクセスするにはログインが必要です。')
      }
      headers['Authorization'] = `Bearer ${tokens.access.trim()}`
    }

    return headers
  }

  const fetchPosts = async (isAdmin = false) => {
    loading.value = true
    error.value = null

    try {
      const endpoint = isAdmin ? endpoints.admin.posts() : endpoints.user.posts()
      const response = await fetch(endpoint, {
        headers: getAuthHeaders(isAdmin),
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
      const response = await fetch(endpoint, {
        headers: getAuthHeaders(isAdmin),
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
      const headers = getAuthHeaders(true)
      const response = await fetch(endpoints.admin.posts(), {
        method: 'POST',
        headers,
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError()
          throw new Error('管理者権限がありません。ログインし直してください。')
        }
        throw new Error(`投稿の作成に失敗しました (${response.status})`)
      }

      return await response.json()
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
      const headers = getAuthHeaders(true)
      const response = await fetch(endpoints.admin.postDetail(id), {
        method: 'PUT',
        headers,
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError()
          throw new Error('管理者権限がありません。ログインし直してください。')
        }
        throw new Error(`投稿の更新に失敗しました (${response.status})`)
      }

      return await response.json()
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
      const headers = getAuthHeaders(true)
      const response = await fetch(endpoints.admin.postDetail(id), {
        method: 'DELETE',
        headers
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
    try {
      const headers = getAuthHeaders(true)
      const response = await fetch(endpoints.admin.posts(), {
        headers,
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