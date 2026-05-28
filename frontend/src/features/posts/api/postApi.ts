import api from '~/shared/libs/axios'

export const postApi = {
  create: (data: {
    caption?: string
    location?: string
    hashtags?: string[]
    music_id?: string
    media_ids: string[]
  }) => api.post('/posts', data).then(res => res.data),

  getAll: () => api.get('/posts').then(res => res.data),
  getById: (id: string) => api.get(`/posts/${id}`).then(res => res.data),
  update: (id: string, data: unknown) => api.put(`/posts/${id}`, data).then(res => res.data),
  remove: (id: string) => api.delete(`/posts/${id}`).then(res => res.data)
}