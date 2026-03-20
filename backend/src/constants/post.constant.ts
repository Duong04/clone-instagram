import { Prisma } from '~/generated/prisma/client'

export const POST_INCLUDE = {
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      avatar: { select: { url: true } }
    }
  },
  media: {
    include: {
      media: {
        select: {
          id: true,
          url: true,
          media_type: true,
          width: true,
          height: true,
          duration: true
        }
      }
    },
    orderBy: { position: 'asc' as const }
  },
  hashtags: {
    include: {
      hashtag: { select: { id: true, name: true } }
    }
  }
} satisfies Prisma.PostInclude
