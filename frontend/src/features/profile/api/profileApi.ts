import api from "~/shared/libs/axios";

export const profileApi = {
    getMeContent: async (limit: number, cursor?: string) => {
        const res = await api.get('/users/me/content', {
            params: { limit, cursor },
        });
        return res.data;
    }
}