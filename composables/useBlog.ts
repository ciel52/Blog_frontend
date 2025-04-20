import { ref } from 'vue'  //すぐに変更できるように
import { API_ENDPOINTS } from '~/constants/api'
import { useAuth } from './useAuth'

export interface BlogPost {
  id: number
  artist: string
  slug: string
  song_title: string
  posted_at: string
  body: string
}

export const useBlog = () => {
  const posts = ref<BlogPost[]>([])
  const currentPost = ref<BlogPost | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { getToken } = useAuth()

  const fetchPosts = async (isAdmin = false) => {
    loading.value = true
    error.value = null
    
    try {
      const endpoint = isAdmin ? API_ENDPOINTS.ADMIN.POSTS() : API_ENDPOINTS.USER.POSTS()
      const token = getToken()
      console.log('投稿一覧取得に使用するトークン:', token)
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
      
      if (token) {
        headers['Authorization'] = `Token ${token}`
      }
      
      const response = await fetch(endpoint, {
        headers,
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('投稿取得エラー詳細:', errorData)
        throw new Error(`投稿の取得に失敗しました (${response.status})`)
      }
      
      const data = await response.json()
      posts.value = Array.isArray(data) ? data : data.results || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      console.error('投稿取得エラー:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchPostById = async (id: number, isAdmin = false): Promise<BlogPost | null> => {
    loading.value = true
    error.value = null
    
    try {
      const getEndpoint = isAdmin ? API_ENDPOINTS.ADMIN.POST_DETAIL : API_ENDPOINTS.USER.POST_DETAIL
      const token = getToken()
      console.log('投稿詳細取得に使用するトークン:', token)
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
      
      if (token) {
        headers['Authorization'] = `Token ${token}`
      }
      
      const response = await fetch(getEndpoint(id), {
        headers,
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('投稿取得エラー詳細:', errorData)
        if (response.status === 404) {
          currentPost.value = null
          return null
        }
        throw new Error(`投稿の取得に失敗しました (${response.status})`)
      }
      
      const data = await response.json()
      currentPost.value = data
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      console.error('投稿取得エラー:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createPost = async (postData: Omit<BlogPost, 'id' | 'slug' | 'posted_at'>): Promise<BlogPost | null> => {
    loading.value = true
    error.value = null
    
    try {
      const token = getToken()
      if (!token) {
        throw new Error('認証トークンがありません。ログインしてください。')
      }
      
      console.log('使用するトークン:', token)
      
      const response = await fetch(API_ENDPOINTS.ADMIN.POSTS(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(postData)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('投稿作成エラー詳細:', errorData)
        throw new Error(`投稿の作成に失敗しました (${response.status})`)
      }
      
      const data = await response.json()
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
      console.error('投稿作成エラー:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    currentPost,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    createPost
  }
}