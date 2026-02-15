import mongoose from 'mongoose'
import { connectToDatabase } from '../config/db.js'
import { env } from '../config/env.js'
import { Post, User } from '../models/index.js'
import { logger } from '../utils/logger.js'

type SeedOptions = {
  users: number
  posts: number
  reset: boolean
}

const parseArgs = (): SeedOptions => {
  const args = process.argv.slice(2)

  const getNumberArg = (name: string, defaultValue: number): number => {
    const index = args.indexOf(name)
    if (index === -1) return defaultValue
    const raw = args[index + 1]
    const parsed = raw ? Number(raw) : NaN
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new Error(`Invalid value for ${name}: ${raw ?? '(missing)'}`)
    }
    return Math.floor(parsed)
  }

  return {
    users: getNumberArg('--users', 20),
    posts: getNumberArg('--posts', 80),
    reset: args.includes('--reset'),
  }
}

const randInt = (maxExclusive: number) => {
  if (maxExclusive <= 0) return 0
  return Math.floor(Math.random() * maxExclusive)
}

const pickOne = <T>(items: T[]): T => {
  if (items.length === 0) throw new Error('pickOne called with empty array')
  return items[randInt(items.length)]
}

const slug = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24)

const generateUser = (i: number) => {
  const base = `cat_${i}_${randInt(10_000)}`
  const username = slug(base) || `cat_${i}`

  return {
    email: `${username}@example.com`,
    username,
    displayName: `Cat ${i}`,
    bio: i % 3 === 0 ? 'Meow. I post cat photos.' : undefined,
    isVerified: i % 10 === 0,
    website: 'https://www.google.com',
    location: 'Montreal, Canada',
  }
}

const generatePostContent = () => {
  const starters = [
    'Look at this floof',
    'Daily cat update',
    'Spotted a cute kitty today',
    'New cat photo drop',
    'Cattos timeline vibes',
  ]
  const endings = ['#cats', '#cattos', '#meow', '#catlife', '#floof', '#purr']

  const starter = pickOne(starters)
  const tag1 = pickOne(endings)
  const tag2 = Math.random() < 0.35 ? ` ${pickOne(endings)}` : ''

  const content = `${starter}! ${tag1}${tag2}`.slice(0, 280)
  const hashtags = (content.match(/#[A-Za-z0-9_]+/g) ?? []).map((t) => t.slice(1).toLowerCase())

  return { content, hashtags }
}

const seedPostMediaUrls = [
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197616/cattos/seeds/cat_avatar_9_qp1j7s.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197621/cattos/seeds/cat_avatar_18_ypaqij.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197621/cattos/seeds/cat_avatar_19_onjr3l.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197619/cattos/seeds/cat_avatar_17_ykb5mj.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197618/cattos/seeds/cat_avatar_16_rybhp9.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197618/cattos/seeds/cat_avatar_15_utfq7c.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197615/cattos/seeds/cat_avatar_14_lw0yxr.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197613/cattos/seeds/cat_avatar_10_cyrooy.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197615/cattos/seeds/cat_avatar_12_rl1dwg.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197614/cattos/seeds/cat_avatar_13_w8uomr.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197614/cattos/seeds/cat_avatar_11_ok8ewh.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197611/cattos/seeds/cat_avatar_8_og8ucl.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197611/cattos/seeds/cat_avatar_7_cnsx1y.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197609/cattos/seeds/cat_avatar_6_hw6twy.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197609/cattos/seeds/cat_avatar_5_rsbinc.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197608/cattos/seeds/cat_avatar_4_zzs1t2.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197607/cattos/seeds/cat_avatar_3_hio0va.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197607/cattos/seeds/cat_avatar_2_wgedow.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197606/cattos/seeds/cat_avatar_1_a9nkih.png',
  'https://res.cloudinary.com/dhj5ncbxs/image/upload/v1771197606/cattos/seeds/cat_avatar_20_ca9e0p.png',
]

const run = async () => {
  if (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test') {
    throw new Error(
      `Refusing to seed when NODE_ENV=${env.NODE_ENV}. Set NODE_ENV=development (or test) to proceed.`
    )
  }

  const options = parseArgs()

  logger.info('[seed] options:', options)

  await connectToDatabase()

  if (options.reset) {
    logger.info('[seed] reset enabled: clearing posts and users')
    await Post.deleteMany({})
    await User.deleteMany({})
  }

  const usersToCreate = Array.from({ length: options.users }, (_, i) => generateUser(i + 1))
  const createdUsers = await User.insertMany(usersToCreate)

  const postsToCreate = Array.from({ length: options.posts }, () => {
    const author = pickOne(createdUsers)
    const { content, hashtags } = generatePostContent()

    return {
      authorId: author._id,
      content,
      hashtags,
      mentions: [],
      mediaUrls: [pickOne(seedPostMediaUrls)],
      visibility: 'public' as const,
    }
  })

  const createdPosts = await Post.insertMany(postsToCreate)

  logger.info(`[seed] created users: ${createdUsers.length}`)
  logger.info(`[seed] created posts: ${createdPosts.length}`)
}

run()
  .catch((err) => {
    logger.error('[seed] failed', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect().catch((err) => {
      logger.warn('[seed] mongoose.disconnect failed:', err)
    })
  })
