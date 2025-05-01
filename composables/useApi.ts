import { useRuntimeConfig } from '#app'

export const useApi = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBaseUrl

  return {
    endpoints: {
      // 認証用エンドポイント
      auth: {
        login: () => `${API_BASE}${config.public.authLoginPath}`,
        refresh: () => `${API_BASE}${config.public.authRefreshPath}`,
        verify: () => `${API_BASE}${config.public.authVerifyPath}`,
      },
      // ユーザー用エンドポイント
      user: {
        posts: () => `${API_BASE}${config.public.blogPostsPath}`,
        postDetail: (id: number) => `${API_BASE}${config.public.blogPostsPath}${id}/`
      },
      // 管理者用エンドポイント
      admin: {
        posts: () => `${API_BASE}${config.public.blogAdminPostsPath}`,
        postDetail: (id: number) => `${API_BASE}${config.public.blogAdminPostsPath}${id}/`
      }
    }
  }
}