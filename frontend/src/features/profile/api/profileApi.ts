import api from "~/shared/libs/axios";
import type { UpdateProfileRequest } from "~/shared/types/auth";
import type { TargetType } from "~/shared/types/feed";

export type ProfileContentType = "all" | Exclude<TargetType, "story">;

export const profileApi = {
    updateMe: async (data: UpdateProfileRequest) => {
        const res = await api.patch('/users/me', data);
        return res.data;
    },

    getMeContent: async (limit: number, cursor?: string, type: ProfileContentType = "all") => {
        const res = await api.get('/users/me/content', {
            params: { limit, cursor, type },
        });
        return res.data;
    },

    getMeSaved: async (limit: number, cursor?: string, type: ProfileContentType = "all") => {
        const res = await api.get('/users/me/saved', {
            params: { limit, cursor, type },
        });
        return res.data;
    },
}
