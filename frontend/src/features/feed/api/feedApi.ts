import api from "~/shared/libs/axios";
import type { TargetType } from "~/shared/types/feed";

export const feedApi = {
    getFeeds: async (limit: number, cursor?: string) => {
        const res = await api.get('/feeds', {
            params: { limit, cursor },
        });
        return res.data;
    },

    markAsSeen: async (targetId: string, targetType: TargetType) => {
        await api.post('/feeds/seen', { targetId, targetType });
    },

    likeFeedItem: async (targetId: string, targetType: TargetType, isLiked: boolean) => {
        await api.post('/feeds/like', { targetId, targetType, isLiked });
    },

    commentFeedItem: async (targetId: string, limit: number) => {
        const res = await api.get(`/feeds/${targetId}/comments`, {
            params: { limit },
        });
        return res.data;
    }
}