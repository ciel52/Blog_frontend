// APIのベースURL
const API_BASE = 'http://localhost:8000'

// APIエンドポイントの定義
export const API_ENDPOINTS = {
  // 認証用エンドポイント
  AUTH: {
    LOGIN: () => `${API_BASE}/api/token/`,
    REFRESH: () => `${API_BASE}/api/token/refresh/`,
    VERIFY: () => `${API_BASE}/api/token/verify/`,
  },
  // ユーザー用エンドポイント
  USER: {
    POSTS: () => `${API_BASE}/blog/posts/`,
    POST_DETAIL: (id: number) => `${API_BASE}/blog/posts/${id}/`
  },
  // 管理者用エンドポイント
  ADMIN: {
    POSTS: () => `${API_BASE}/blog/admin/posts/`,
    POST_DETAIL: (id: number) => `${API_BASE}/blog/admin/posts/${id}/`
  }
} as const