import { prisma } from '../src/config/database'

async function main() {
  await prisma.media.upsert({
    where: { id: 'default-avatar' },
    update: {},
    create: {
      id: 'default-avatar',
      public_id: 'public_id_default',
      url: 'https://res.cloudinary.com/dsdyprt1q/image/upload/v1726997687/CLINIC/avatars/kcopet60brdlxcpybxjw.png',
      media_type: 'image'
    }
  })

  console.log('✅ Seed completed')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
