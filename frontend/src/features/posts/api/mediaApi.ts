import api from '~/shared/libs/axios'

export const mediaApi = {
  uploadMultiple: (formData: FormData) =>
    api.post('/media/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),

  deleteOne: (id: string) =>
    api.delete(`/media/${id}`).then(res => res.data),

  deleteMany: (ids: string[]) =>
    api.delete('/media/upload-multiple', { data: { ids } }).then(res => res.data)
}