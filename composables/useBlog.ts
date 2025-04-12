import { ref } from 'vue'  //すぐに変更できるように

export interface BlogPost {
  id: number
  song_title: string
  artist: string
  body: string
  posted_at: string
  slug: string
}

export const useBlog = () => {
  const posts = ref<BlogPost[]>([])
  const currentPost = ref<BlogPost | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPosts = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('http://127.0.0.1:8000/blog/posts/')
      if (!response.ok) {
        throw new Error('ブログ記事の取得に失敗しました')
      }
      const data = await response.json()
      posts.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
    } finally {
      loading.value = false
    }
  }

  const fetchPostById = async (id: number) => {
    loading.value = true
    error.value = null
    currentPost.value = null

    try {
      const response = await fetch(`http://127.0.0.1:8000/blog/posts/${id}/`)
      if (!response.ok) {
        throw new Error('ブログ記事の取得に失敗しました')
      }
      const data = await response.json()
      currentPost.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '予期せぬエラーが発生しました'
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
    fetchPostById
  }
}