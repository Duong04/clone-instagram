import api from "~/shared/libs/axios";

export const feedApi = {
    getFeed: async (limit: number, cursor?: string) => {
        const res = await api.get('/feeds', {
            params: { limit, cursor },
        });
        return res.data;
    },

    markAsSeen: async (targetId: string, targetType: "post" | "reel") => {
        await api.post('/feeds/seen', { targetId, targetType });
    }
}