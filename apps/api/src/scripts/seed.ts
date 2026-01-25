import mongoose from 'mongoose'
import { connectToDatabase } from '../config/db.js'
import { env } from '../config/env.js'
import { Post, User } from '../models/index.js'

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

const run = async () => {
  if (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test') {
    throw new Error(
      `Refusing to seed when NODE_ENV=${env.NODE_ENV}. Set NODE_ENV=development (or test) to proceed.`
    )
  }

  const options = parseArgs()

  console.log('[seed] options:', options)

  await connectToDatabase()

  if (options.reset) {
    console.log('[seed] reset enabled: clearing posts and users')
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
      mediaUrls: [],
      visibility: 'public' as const,
    }
  })

  const createdPosts = await Post.insertMany(postsToCreate)

  console.log(`[seed] created users: ${createdUsers.length}`)
  console.log(`[seed] created posts: ${createdPosts.length}`)
}

run()
  .catch((err) => {
    console.error('[seed] failed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined)
  })
