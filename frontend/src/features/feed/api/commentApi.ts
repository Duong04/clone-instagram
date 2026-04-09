import api from "~/shared/libs/axios";
import type { TargetType } from "~/shared/types/feed";

export const commentApi = {
    getComments: async (id: string) => {
        const res = await api.get(`/comments/${id}`);
        return res.data;
    },

    getReplies: async (id: string, limit: number, cursor?: string) => {
        const res = await api.get(`/comments/${id}/replies`, {
            params: { limit, cursor },
        });
        return res.data;
    },

    createComment: async (content: string, targetId: string, targetType: TargetType, parentId?: string) => {
        const res = await api.post('/comments', {
            content,
            target_id: targetId,
            target_type: targetType,
            parent_id: parentId,
        });
        return res.data;
    },

    updateComment: async (id: string, content: string) => {
        const res = await api.put(`/comments/${id}`, { content });
        return res.data;
    },

    deleteComment: async (id: string) => {
        await api.delete(`/comments/${id}`);
    }
}