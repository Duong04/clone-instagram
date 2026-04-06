import api from "~/shared/libs/axios";
import type { TargetType } from "~/shared/types/feed";

export const feedApi = {
    getFeed: async (limit: number, cursor?: string) => {
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
    }
}