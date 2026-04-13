import { prisma } from '../src/config/database'
import {
  FollowStatus,
  MessageType,
  NotificationType,
  EntityType,
  ContentType,
  ReportTargetType,
  ConversationRole
} from '../src/generated/prisma/client'
import * as bcrypt from 'bcryptjs'

// ─── HELPERS ────────────────────────────────────────────────────────────────

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function randBool(trueChance = 0.5) {
  return Math.random() < trueChance
}
function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}
function hoursAgo(n: number) {
  const d = new Date()
  d.setHours(d.getHours() - n)
  return d
}

// ─── REAL WORKING MEDIA URLS ────────────────────────────────────────────────

/**
 * Avatar: DiceBear (SVG tự động generate từ seed, luôn hoạt động, miễn phí)
 * https://www.dicebear.com/
 */
const AVATAR_URLS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=alex',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=minh',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=tommy',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=lily',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=hieu',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=anna',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=david',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=trang',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=kevin',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=jessica',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=nam',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=emily',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=ryan',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=linh',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=chris',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=mai',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=jake',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=thu',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=ben'
]

/**
 * Post images: Lorem Picsum (random ảnh đẹp có seed cố định, luôn hoạt động)
 * https://picsum.photos/
 * Format: https://picsum.photos/seed/{seed}/{width}/{height}
 */
const POST_IMAGE_URLS = [
  'https://picsum.photos/seed/post1/1080/1080',
  'https://picsum.photos/seed/post2/1080/1350',
  'https://picsum.photos/seed/post3/1080/1080',
  'https://picsum.photos/seed/post4/1080/1350',
  'https://picsum.photos/seed/post5/1080/1080',
  'https://picsum.photos/seed/post6/1080/1350',
  'https://picsum.photos/seed/post7/1080/1080',
  'https://picsum.photos/seed/post8/1080/1350',
  'https://picsum.photos/seed/post9/1080/1080',
  'https://picsum.photos/seed/post10/1080/1350',
  'https://picsum.photos/seed/travel1/1080/1080',
  'https://picsum.photos/seed/travel2/1080/1350',
  'https://picsum.photos/seed/nature1/1080/1080',
  'https://picsum.photos/seed/nature2/1080/1350',
  'https://picsum.photos/seed/city1/1080/1080',
  'https://picsum.photos/seed/city2/1080/1350',
  'https://picsum.photos/seed/food1/1080/1080',
  'https://picsum.photos/seed/food2/1080/1350',
  'https://picsum.photos/seed/fashion1/1080/1080',
  'https://picsum.photos/seed/fashion2/1080/1350',
  'https://picsum.photos/seed/portrait1/1080/1080',
  'https://picsum.photos/seed/portrait2/1080/1350',
  'https://picsum.photos/seed/street1/1080/1080',
  'https://picsum.photos/seed/street2/1080/1350',
  'https://picsum.photos/seed/sunset1/1080/1080',
  'https://picsum.photos/seed/sunset2/1080/1350',
  'https://picsum.photos/seed/beach1/1080/1080',
  'https://picsum.photos/seed/beach2/1080/1350',
  'https://picsum.photos/seed/mountain1/1080/1080',
  'https://picsum.photos/seed/mountain2/1080/1350',
  'https://picsum.photos/seed/coffee1/1080/1080',
  'https://picsum.photos/seed/coffee2/1080/1350',
  'https://picsum.photos/seed/gym1/1080/1080',
  'https://picsum.photos/seed/gym2/1080/1350',
  'https://picsum.photos/seed/art1/1080/1080',
  'https://picsum.photos/seed/art2/1080/1350',
  'https://picsum.photos/seed/music1/1080/1080',
  'https://picsum.photos/seed/music2/1080/1350',
  'https://picsum.photos/seed/drone1/1080/1080',
  'https://picsum.photos/seed/drone2/1080/1350'
]

/**
 * Story images: dọc 9:16
 */
const STORY_IMAGE_URLS = [
  'https://picsum.photos/seed/story1/1080/1920',
  'https://picsum.photos/seed/story2/1080/1920',
  'https://picsum.photos/seed/story3/1080/1920',
  'https://picsum.photos/seed/story4/1080/1920',
  'https://picsum.photos/seed/story5/1080/1920',
  'https://picsum.photos/seed/story6/1080/1920',
  'https://picsum.photos/seed/story7/1080/1920',
  'https://picsum.photos/seed/story8/1080/1920',
  'https://picsum.photos/seed/story9/1080/1920',
  'https://picsum.photos/seed/story10/1080/1920'
]

/**
 * Reel videos: Pexels public sample videos (free, no auth, MP4 trực tiếp)
 * Đây là các video sample chính thức từ Pexels CDN
 */
const REEL_VIDEO_URLS = [
  'https://videos.pexels.com/video-files/1448735/1448735-uhd_1440_2732_25fps.mp4',
  'https://videos.pexels.com/video-files/2278095/2278095-uhd_2560_1440_30fps.mp4',
  'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4763824/4763824-hd_1080_1920_25fps.mp4',
  'https://videos.pexels.com/video-files/5519130/5519130-hd_1080_1920_30fps.mp4',
  'https://videos.pexels.com/video-files/6238297/6238297-hd_1080_1920_24fps.mp4',
  'https://videos.pexels.com/video-files/7565433/7565433-hd_1080_1920_30fps.mp4',
  'https://videos.pexels.com/video-files/8100349/8100349-hd_1080_1920_25fps.mp4',
  'https://videos.pexels.com/video-files/9395422/9395422-hd_1080_1920_30fps.mp4',
  'https://videos.pexels.com/video-files/3045163/3045163-uhd_2560_1440_30fps.mp4'
]

/**
 * Music covers: Picsum
 */
const MUSIC_COVER_URLS = [
  'https://picsum.photos/seed/album1/500/500',
  'https://picsum.photos/seed/album2/500/500',
  'https://picsum.photos/seed/album3/500/500',
  'https://picsum.photos/seed/album4/500/500',
  'https://picsum.photos/seed/album5/500/500'
]

// ─── DATA POOLS ─────────────────────────────────────────────────────────────

const USERNAMES = [
  'alex_photo',
  'minh_nguyen',
  'sarah_creates',
  'tommy_travel',
  'lily_lifestyle',
  'hieu_dev',
  'anna_art',
  'david_drone',
  'trang_beauty',
  'kevin_food',
  'jessica_fit',
  'nam_explorer',
  'emily_style',
  'ryan_shots',
  'linh_vlog',
  'chris_nature',
  'mai_cooking',
  'jake_street',
  'thu_fashion',
  'ben_music'
]

const FULL_NAMES = [
  'Alex Johnson',
  'Minh Nguyễn',
  'Sarah Creates',
  'Tommy Traveler',
  'Lily Life',
  'Hiếu Dev',
  'Anna Artist',
  'David Droner',
  'Trang Beauty',
  'Kevin Foodie',
  'Jessica Fit',
  'Nam Explorer',
  'Emily Style',
  'Ryan Shots',
  'Linh Vlogger',
  'Chris Nature',
  'Mai Cooking',
  'Jake Street',
  'Thu Fashion',
  'Ben Music'
]

const BIOS = [
  '📸 Capturing moments that matter',
  '✈️ Traveling the world one photo at a time',
  '🌿 Nature lover | Coffee addict | Film photographer',
  '👨‍💻 Developer by day, creator by night',
  '🍜 Food is life | Ho Chi Minh City 🇻🇳',
  '💪 Fitness enthusiast | Personal trainer',
  '🎨 Digital artist & illustrator',
  '🎵 Music producer | Sound engineer',
  '🌅 Chasing sunsets around the globe',
  '📖 Reader | Writer | Dreamer'
]

const CAPTIONS = [
  'Golden hour never disappoints 🌅 #photography #travel',
  'Exploring hidden gems in the city 🏙️ #urban #explore',
  'Nothing beats a perfect cup of coffee ☕ #coffeetime #morning',
  'Weekend vibes only 🌊 #weekend #relax #beach',
  'The mountains are calling and I must go 🏔️ #hiking #adventure',
  'Street food hunting in Hội An 🥢 #foodie #vietnam #travel',
  'Late night coding sessions 💻 #developer #startup #grind',
  'When the light hits just right ✨ #photography #golden',
  'New collection drop! 🔥 #fashion #ootd #style',
  'Gym is my therapy 💪 #fitness #workout #gains',
  'Sunset from the rooftop 🌇 #cityview #sunset #hanoi',
  'Making memories one trip at a time ✈️ #wanderlust #travel',
  'This view never gets old 😍 #landscape #nature #peace',
  'Family time is the best time 👨‍👩‍👧‍👦 #family #love #blessed',
  'Just vibing 🎶 #music #chill #goodvibes'
]

const REEL_CAPTIONS = [
  'POV: You found the best café in town ☕ #reel #viral',
  'Day in my life as a content creator 🎬 #dayinmylife #creator',
  'How I edited this photo in 60 seconds 📱 #tutorial #photography',
  'Morning routine that changed my life 🌅 #routine #wellness',
  'Street food tour in 60 seconds 🍜 #foodtour #vietnam',
  'Thrift flip transformation 👗 #fashion #thrift #sustainable',
  'Gym motivation for when you want to quit 💪 #fitness #motivation',
  'Sunset timelapse from my balcony 🌇 #timelapse #sunset',
  'How to make Vietnamese coffee at home ☕ #recipe #coffee',
  'My camera setup for travel photography 📷 #gear #photography'
]

const LOCATIONS = [
  'Hà Nội, Việt Nam',
  'TP. Hồ Chí Minh',
  'Đà Nẵng, Việt Nam',
  'Hội An, Quảng Nam',
  'Nha Trang, Khánh Hòa',
  'Đà Lạt, Lâm Đồng',
  'Bangkok, Thailand',
  'Bali, Indonesia',
  'Tokyo, Japan',
  'Seoul, Korea'
]

const HASHTAG_NAMES = [
  'photography',
  'travel',
  'food',
  'fitness',
  'fashion',
  'art',
  'music',
  'nature',
  'lifestyle',
  'vietnam',
  'explore',
  'daily',
  'sunset',
  'coffee',
  'street',
  'portrait',
  'landscape',
  'ootd',
  'workout',
  'foodie',
  'hanoi',
  'saigon',
  'danang',
  'hoian',
  'wanderlust',
  'adventure',
  'coding',
  'developer',
  'startup',
  'creative'
]

const COMMENT_TEXTS = [
  'Wow, absolutely stunning! 😍',
  'This is goals 🔥',
  'Love this so much! ❤️',
  'Beautiful shot! 📸',
  'Where is this place?? I need to go!',
  'You always have the best content 🙌',
  'This made my day 😊',
  'Incredible vibes ✨',
  '🔥🔥🔥',
  "Can't stop looking at this",
  'Major inspiration right here 💫',
  'This is everything 😭❤️',
  'Gorgeous as always!',
  'Need this in my life ASAP',
  'Tag me next time! 🙏',
  'How do you always find these places?',
  'Living the dream 🌟',
  'Obsessed with your feed 🤩',
  'This deserves way more likes',
  'Please share the location!'
]

const MUSIC_DATA = [
  { title: 'Blinding Lights', artist: 'The Weeknd', duration: 200 },
  { title: 'Shape of You', artist: 'Ed Sheeran', duration: 234 },
  { title: 'Levitating', artist: 'Dua Lipa', duration: 203 },
  { title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', duration: 141 },
  { title: 'Good 4 U', artist: 'Olivia Rodrigo', duration: 178 },
  { title: 'Montero', artist: 'Lil Nas X', duration: 137 },
  { title: 'Peaches', artist: 'Justin Bieber', duration: 198 },
  { title: 'Kiss Me More', artist: 'Doja Cat ft. SZA', duration: 208 },
  { title: 'Leave The Door Open', artist: 'Bruno Mars', duration: 242 },
  { title: 'Butter', artist: 'BTS', duration: 164 }
]

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed...\n')

  // ── 0. DEFAULT AVATAR (giữ nguyên seed gốc của bạn) ─────────────────────
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

  // ── 1. AVATAR MEDIA ──────────────────────────────────────────────────────
  console.log('🖼️  Creating avatar media...')
  const avatarMediaList: any[] = []
  for (let i = 0; i < 20; i++) {
    const media = await prisma.media.upsert({
      where: { public_id: `seed_avatar_${i}` },
      update: {},
      create: {
        public_id: `seed_avatar_${i}`,
        url: AVATAR_URLS[i],
        media_type: 'image',
        width: 400,
        height: 400
      }
    })
    avatarMediaList.push(media)
  }

  // ── 2. POST IMAGE MEDIA ──────────────────────────────────────────────────
  console.log('📸 Creating post image media...')
  const postImageMedia: any[] = []
  for (let i = 0; i < POST_IMAGE_URLS.length; i++) {
    const media = await prisma.media.upsert({
      where: { public_id: `seed_post_img_${i}` },
      update: {},
      create: {
        public_id: `seed_post_img_${i}`,
        url: POST_IMAGE_URLS[i],
        media_type: 'image',
        width: 1080,
        height: i % 2 === 0 ? 1080 : 1350
      }
    })
    postImageMedia.push(media)
  }

  // ── 3. STORY IMAGE MEDIA ─────────────────────────────────────────────────
  console.log('📖 Creating story media...')
  const storyMedia: any[] = []
  for (let i = 0; i < STORY_IMAGE_URLS.length; i++) {
    const media = await prisma.media.upsert({
      where: { public_id: `seed_story_${i}` },
      update: {},
      create: {
        public_id: `seed_story_${i}`,
        url: STORY_IMAGE_URLS[i],
        media_type: 'image',
        width: 1080,
        height: 1920
      }
    })
    storyMedia.push(media)
  }

  // ── 4. REEL VIDEO MEDIA ──────────────────────────────────────────────────
  console.log('🎬 Creating reel video media...')
  const reelVideoMedia: any[] = []
  for (let i = 0; i < REEL_VIDEO_URLS.length; i++) {
    const media = await prisma.media.upsert({
      where: { public_id: `seed_reel_${i}` },
      update: {},
      create: {
        public_id: `seed_reel_${i}`,
        url: REEL_VIDEO_URLS[i],
        media_type: 'video',
        width: 1080,
        height: 1920,
        duration: randInt(15, 90)
      }
    })
    reelVideoMedia.push(media)
  }

  // ── 5. MUSIC ─────────────────────────────────────────────────────────────
  console.log('🎵 Creating music...')
  const musicList: any[] = []
  for (let i = 0; i < MUSIC_DATA.length; i++) {
    const m = MUSIC_DATA[i]
    const music = await prisma.music.upsert({
      where: { id: `seed_music_${i}` },
      update: {},
      create: {
        id: `seed_music_${i}`,
        title: m.title,
        artist: m.artist,
        url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i + 1}.mp3`,
        duration: m.duration,
        cover_url: MUSIC_COVER_URLS[i % MUSIC_COVER_URLS.length]
      }
    })
    musicList.push(music)
  }

  // ── 6. USERS ─────────────────────────────────────────────────────────────
  console.log('👤 Creating users...')
  const hashedPassword = await bcrypt.hash('Password@123', 10)
  const users: any[] = []

  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.upsert({
      where: { username: USERNAMES[i] },
      update: {},
      create: {
        username: USERNAMES[i],
        email: `${USERNAMES[i]}@example.com`,
        password: hashedPassword,
        name: FULL_NAMES[i],
        bio: BIOS[i % BIOS.length],
        avatar_id: avatarMediaList[i].id,
        website: randBool(0.4) ? `https://${USERNAMES[i]}.com` : null,
        is_active: true,
        is_private: randBool(0.15),
        created_at: daysAgo(randInt(30, 365))
      }
    })

    await prisma.userSetting.upsert({
      where: { user_id: user.id },
      update: {},
      create: {
        user_id: user.id,
        allow_tag: randBool(0.85),
        allow_message: randBool(0.9),
        allow_comment: randBool(0.95),
        show_activity: randBool(0.7)
      }
    })

    await prisma.userSession.create({
      data: {
        user_id: user.id,
        device: rand(['iPhone 15', 'Samsung Galaxy S24', 'MacBook Pro', 'Chrome/Windows']),
        ip_address: `192.168.${randInt(1, 255)}.${randInt(1, 255)}`,
        last_active: hoursAgo(randInt(0, 48))
      }
    })

    users.push(user)
  }

  // ── 7. HASHTAGS ──────────────────────────────────────────────────────────
  console.log('🏷️  Creating hashtags...')
  const hashtags: any[] = []
  for (const name of HASHTAG_NAMES) {
    const ht = await prisma.hashtag.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    hashtags.push(ht)
  }

  // ── 8. POSTS ─────────────────────────────────────────────────────────────
  console.log('📸 Creating posts...')
  const posts: any[] = []

  for (let i = 0; i < 60; i++) {
    const user = users[i % users.length]
    const mediaCount = randInt(1, 3)

    const post = await prisma.post.create({
      data: {
        user_id: user.id,
        caption: CAPTIONS[i % CAPTIONS.length],
        location: randBool(0.6) ? rand(LOCATIONS) : null,
        music_id: randBool(0.3) ? rand(musicList).id : null,
        like_count: randInt(5, 2000),
        comment_count: randInt(0, 150),
        comments_disabled: randBool(0.05),
        created_at: daysAgo(randInt(0, 30))
      }
    })

    for (let j = 0; j < mediaCount; j++) {
      const mediaItem = postImageMedia[(i * 3 + j) % postImageMedia.length]
      await prisma.postMedia.create({
        data: { post_id: post.id, media_id: mediaItem.id, position: j }
      })
    }

    const usedHT = new Set<string>()
    for (let k = 0; k < randInt(1, 4); k++) {
      const ht = rand(hashtags)
      if (!usedHT.has(ht.id)) {
        usedHT.add(ht.id)
        await prisma.postHashtag.create({
          data: { post_id: post.id, hashtag_id: ht.id }
        })
      }
    }

    posts.push(post)
  }

  // ── 9. REELS ─────────────────────────────────────────────────────────────
  console.log('🎬 Creating reels...')
  const reels: any[] = []

  for (let i = 0; i < 30; i++) {
    const user = users[i % users.length]
    const mediaItem = reelVideoMedia[i % reelVideoMedia.length]

    const reel = await prisma.reel.create({
      data: {
        user_id: user.id,
        media_id: mediaItem.id,
        caption: REEL_CAPTIONS[i % REEL_CAPTIONS.length],
        location: randBool(0.5) ? rand(LOCATIONS) : null,
        music_id: randBool(0.7) ? rand(musicList).id : null,
        like_count: randInt(50, 10000),
        comment_count: randInt(5, 500),
        comments_disabled: randBool(0.05),
        created_at: daysAgo(randInt(0, 20))
      }
    })

    const usedHT = new Set<string>()
    for (let k = 0; k < randInt(2, 5); k++) {
      const ht = rand(hashtags)
      if (!usedHT.has(ht.id)) {
        usedHT.add(ht.id)
        await prisma.reelHashtag.create({
          data: { reel_id: reel.id, hashtag_id: ht.id }
        })
      }
    }

    reels.push(reel)
  }

  // ── 10. STORIES ──────────────────────────────────────────────────────────
  console.log('📖 Creating stories...')
  const stories: any[] = []

  for (let i = 0; i < 40; i++) {
    const user = users[i % users.length]
    const mediaItem = storyMedia[i % storyMedia.length]
    const createdAt = hoursAgo(randInt(0, 23))

    const story = await prisma.story.create({
      data: {
        user_id: user.id,
        media_id: mediaItem.id,
        music_id: randBool(0.4) ? rand(musicList).id : null,
        expires_at: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000),
        created_at: createdAt
      }
    })
    stories.push(story)
  }

  // ── 11. FOLLOWS ──────────────────────────────────────────────────────────
  console.log('👥 Creating follows...')
  const followPairs = new Set<string>()

  for (const user of users) {
    const candidates = users.filter((u) => u.id !== user.id)
    for (let i = 0; i < randInt(3, 15); i++) {
      const target = candidates[randInt(0, candidates.length - 1)]
      const key = `${user.id}-${target.id}`
      if (!followPairs.has(key)) {
        followPairs.add(key)
        await prisma.follow.create({
          data: {
            follower_id: user.id,
            following_id: target.id,
            status: target.is_private ? rand([FollowStatus.accepted, FollowStatus.pending]) : FollowStatus.accepted,
            created_at: daysAgo(randInt(0, 60))
          }
        })
      }
    }
  }

  // ── 12. LIKES ────────────────────────────────────────────────────────────
  console.log('❤️  Creating likes...')
  const likePairs = new Set<string>()

  for (const user of users) {
    for (const post of posts.slice(0, randInt(5, 20))) {
      const key = `${user.id}-post-${post.id}`
      if (!likePairs.has(key)) {
        likePairs.add(key)
        await prisma.like.create({
          data: {
            user_id: user.id,
            target_type: ContentType.post,
            target_id: post.id,
            created_at: daysAgo(randInt(0, 15))
          }
        })
      }
    }
    for (const reel of reels.slice(0, randInt(2, 10))) {
      const key = `${user.id}-reel-${reel.id}`
      if (!likePairs.has(key)) {
        likePairs.add(key)
        await prisma.like.create({
          data: {
            user_id: user.id,
            target_type: ContentType.reel,
            target_id: reel.id,
            created_at: daysAgo(randInt(0, 10))
          }
        })
      }
    }
  }

  // ── 13. VIEWS ────────────────────────────────────────────────────────────
  console.log('👁️  Creating views...')
  const viewPairs = new Set<string>()

  for (const user of users) {
    for (const reel of reels.slice(0, randInt(5, 20))) {
      const key = `${user.id}-reel-${reel.id}`
      if (!viewPairs.has(key)) {
        viewPairs.add(key)
        await prisma.view.create({
          data: {
            user_id: user.id,
            target_type: ContentType.reel,
            target_id: reel.id,
            created_at: daysAgo(randInt(0, 7))
          }
        })
      }
    }
    for (const story of stories.slice(0, randInt(2, 10))) {
      const key = `${user.id}-story-${story.id}`
      if (!viewPairs.has(key)) {
        viewPairs.add(key)
        await prisma.view.create({
          data: {
            user_id: user.id,
            target_type: ContentType.story,
            target_id: story.id,
            created_at: hoursAgo(randInt(0, 20))
          }
        })
      }
    }
  }

  // ── 14. SAVES ────────────────────────────────────────────────────────────
  console.log('🔖 Creating saves...')
  const savePairs = new Set<string>()

  for (const user of users) {
    for (const post of posts.slice(0, randInt(3, 12))) {
      const key = `${user.id}-post-${post.id}`
      if (!savePairs.has(key)) {
        savePairs.add(key)
        await prisma.save.create({
          data: {
            user_id: user.id,
            target_type: ContentType.post,
            target_id: post.id,
            created_at: daysAgo(randInt(0, 20))
          }
        })
      }
    }
  }

  // ── 15. COMMENTS ─────────────────────────────────────────────────────────
  console.log('💬 Creating comments...')
  const comments: any[] = []

  for (const post of posts.slice(0, 30)) {
    for (let i = 0; i < randInt(1, 8); i++) {
      const comment = await prisma.comment.create({
        data: {
          user_id: rand(users).id,
          target_type: ContentType.post,
          target_id: post.id,
          content: rand(COMMENT_TEXTS),
          like_count: randInt(0, 50),
          created_at: daysAgo(randInt(0, 15))
        }
      })
      comments.push(comment)

      if (randBool(0.3)) {
        const reply = await prisma.comment.create({
          data: {
            user_id: rand(users).id,
            target_type: ContentType.post,
            target_id: post.id,
            parent_id: comment.id,
            content: rand(COMMENT_TEXTS),
            like_count: randInt(0, 10),
            created_at: daysAgo(randInt(0, 10))
          }
        })
        comments.push(reply)
      }
    }
  }

  // Comment likes
  const commentLikePairs = new Set<string>()
  for (const comment of comments.slice(0, 80)) {
    for (let i = 0; i < randInt(0, 5); i++) {
      const user = rand(users)
      const key = `${user.id}-${comment.id}`
      if (!commentLikePairs.has(key)) {
        commentLikePairs.add(key)
        await prisma.commentLike.create({
          data: { user_id: user.id, comment_id: comment.id }
        })
      }
    }
  }

  // ── 16. MENTIONS ─────────────────────────────────────────────────────────
  console.log('@ Creating mentions...')
  for (let i = 0; i < 30; i++) {
    const actor = rand(users)
    const mentioned = users.find((u) => u.id !== actor.id)!
    const targetType = rand([EntityType.post, EntityType.comment, EntityType.reel])
    const targetId =
      targetType === EntityType.post
        ? rand(posts).id
        : targetType === EntityType.comment
          ? rand(comments).id
          : rand(reels).id

    await prisma.mention.create({
      data: {
        user_id: mentioned.id,
        actor_id: actor.id,
        target_type: targetType,
        target_id: targetId,
        created_at: daysAgo(randInt(0, 15))
      }
    })
  }

  // ── 17. NOTIFICATIONS ────────────────────────────────────────────────────
  console.log('🔔 Creating notifications...')
  for (const user of users) {
    for (let i = 0; i < randInt(3, 12); i++) {
      const actor = users.find((u) => u.id !== user.id)!
      const type = rand([
        NotificationType.like,
        NotificationType.comment,
        NotificationType.follow,
        NotificationType.mention
      ])
      await prisma.notification.create({
        data: {
          user_id: user.id,
          actor_id: actor.id,
          type,
          entity_type: type !== NotificationType.follow ? rand([EntityType.post, EntityType.reel]) : null,
          entity_id: type !== NotificationType.follow ? rand(posts).id : null,
          is_read: randBool(0.4),
          created_at: daysAgo(randInt(0, 14))
        }
      })
    }
  }

  // ── 18. USER TAGS ────────────────────────────────────────────────────────
  console.log('🏷️  Creating user tags...')
  const userTagPairs = new Set<string>()
  for (let i = 0; i < 30; i++) {
    const tagger = rand(users)
    const tagged = users.find((u) => u.id !== tagger.id)!
    const type = rand([ContentType.post, ContentType.reel])
    const targetId = type === ContentType.post ? rand(posts).id : rand(reels).id
    const key = `${tagger.id}-${tagged.id}-${type}-${targetId}`
    if (!userTagPairs.has(key)) {
      userTagPairs.add(key)
      await prisma.userTag.create({
        data: { tagger_id: tagger.id, tagged_id: tagged.id, target_type: type, target_id: targetId }
      })
    }
  }

  // ── 19. FEEDS ────────────────────────────────────────────────────────────
  console.log('📰 Creating feeds...')
  const feedPairs = new Set<string>()
  for (const user of users) {
    for (const post of posts.slice(0, randInt(5, 20))) {
      const key = `${user.id}-post-${post.id}`
      if (!feedPairs.has(key)) {
        feedPairs.add(key)
        await prisma.feed.create({
          data: {
            user_id: user.id,
            target_type: ContentType.post,
            target_id: post.id,
            score: Math.random() * 100,
            created_at: daysAgo(randInt(0, 7))
          }
        })
      }
    }
    for (const reel of reels.slice(0, randInt(3, 10))) {
      const key = `${user.id}-reel-${reel.id}`
      if (!feedPairs.has(key)) {
        feedPairs.add(key)
        await prisma.feed.create({
          data: {
            user_id: user.id,
            target_type: ContentType.reel,
            target_id: reel.id,
            score: Math.random() * 100,
            created_at: daysAgo(randInt(0, 5))
          }
        })
      }
    }
  }

  // ── 20. SEARCH HISTORY ───────────────────────────────────────────────────
  console.log('🔍 Creating search history...')
  const keywords = [
    'travel',
    'photography',
    'food',
    'hanoi',
    'fashion',
    'fitness',
    'art',
    'coffee',
    'beach',
    'mountains'
  ]
  for (const user of users) {
    for (let i = 0; i < randInt(2, 8); i++) {
      await prisma.searchHistory.create({
        data: { user_id: user.id, keyword: rand(keywords), created_at: daysAgo(randInt(0, 14)) }
      })
    }
  }

  // ── 21. CONVERSATIONS & MESSAGES ─────────────────────────────────────────
  console.log('💌 Creating conversations & messages...')
  const convPairs = new Set<string>()

  // DMs
  for (let i = 0; i < 15; i++) {
    const userA = users[i % users.length]
    const userB = users[(i + 1) % users.length]
    const key = [userA.id, userB.id].sort().join('-')
    if (convPairs.has(key)) continue
    convPairs.add(key)

    const conv = await prisma.conversation.create({
      data: { is_group: false, last_message_at: hoursAgo(randInt(0, 72)) }
    })

    await prisma.conversationUser.createMany({
      data: [
        { conversation_id: conv.id, user_id: userA.id, role: ConversationRole.member },
        { conversation_id: conv.id, user_id: userB.id, role: ConversationRole.member }
      ]
    })

    for (let m = 0; m < randInt(3, 15); m++) {
      const sender = randBool() ? userA : userB
      const msgType = randBool(0.8) ? MessageType.text : MessageType.image
      const msg = await prisma.message.create({
        data: {
          conversation_id: conv.id,
          sender_id: sender.id,
          content: msgType === MessageType.text ? rand(COMMENT_TEXTS) : null,
          media_id: msgType === MessageType.image ? rand(postImageMedia).id : null,
          message_type: msgType,
          created_at: hoursAgo(randInt(0, 48))
        }
      })

      if (randBool(0.5)) {
        const reader = sender.id === userA.id ? userB : userA
        await prisma.messageRead.create({
          data: { message_id: msg.id, user_id: reader.id }
        })
      }
    }
  }

  // Group conversations
  for (let g = 0; g < 3; g++) {
    const admin = users[g]
    const members = users.slice(g, g + randInt(3, 6))

    const groupConv = await prisma.conversation.create({
      data: {
        is_group: true,
        name: rand(['Travel Buddies 🌍', 'Photo Club 📸', 'Foodie Squad 🍜', 'Dev Team 💻']),
        avatar_id: avatarMediaList[g].id,
        admin_id: admin.id,
        last_message_at: hoursAgo(randInt(0, 24))
      }
    })

    await prisma.conversationUser.createMany({
      data: members.map((u, idx) => ({
        conversation_id: groupConv.id,
        user_id: u.id,
        role: idx === 0 ? ConversationRole.admin : ConversationRole.member
      }))
    })

    for (let m = 0; m < randInt(5, 20); m++) {
      await prisma.message.create({
        data: {
          conversation_id: groupConv.id,
          sender_id: rand(members).id,
          content: rand(COMMENT_TEXTS),
          message_type: MessageType.text,
          created_at: hoursAgo(randInt(0, 24))
        }
      })
    }
  }

  // ── 22. BLOCKS ───────────────────────────────────────────────────────────
  console.log('🚫 Creating blocks...')
  for (let i = 0; i < 5; i++) {
    await prisma.userBlock.create({
      data: { user_id: users[i].id, blocked_user_id: users[i + 10].id }
    })
  }

  // ── 23. REPORTS ──────────────────────────────────────────────────────────
  console.log('🚨 Creating reports...')
  const reportReasons = ['Spam', 'Inappropriate content', 'Harassment', 'False information', 'Nudity']
  for (let i = 0; i < 10; i++) {
    const type = rand([ReportTargetType.post, ReportTargetType.reel, ReportTargetType.user, ReportTargetType.comment])
    await prisma.report.create({
      data: {
        reporter_id: rand(users).id,
        target_type: type,
        target_id:
          type === ReportTargetType.post
            ? rand(posts).id
            : type === ReportTargetType.reel
              ? rand(reels).id
              : type === ReportTargetType.comment
                ? rand(comments).id
                : rand(users).id,
        reason: rand(reportReasons),
        created_at: daysAgo(randInt(0, 30))
      }
    })
  }

  // ── SUMMARY ──────────────────────────────────────────────────────────────
  console.log('\n✅ Seed completed!')
  console.log('─'.repeat(45))
  console.log(`👤 Users:           ${users.length}`)
  console.log(`📸 Posts:           ${posts.length}`)
  console.log(`🎬 Reels:           ${reels.length}`)
  console.log(`📖 Stories:         ${stories.length}`)
  console.log(`🎵 Music:           ${musicList.length}`)
  console.log(`🏷️  Hashtags:       ${hashtags.length}`)
  console.log(`❤️  Likes:          ${likePairs.size}`)
  console.log(`👥 Follows:         ${followPairs.size}`)
  console.log(`💬 Comments:        ${comments.length}`)
  console.log('─'.repeat(45))
  console.log('🔑 Password tất cả users: Password@123')
  console.log('📧 VD: alex_photo@example.com / Password@123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
