import type { Post } from '@cattos/shared'

export const resolvePostAuthors = (
  post: Post,
  usersById?: Record<string, Post['author']> | null
): Post => {
  if (!usersById) return post

  const resolve = (author?: Post['author'] | null): Post['author'] | undefined => {
    if (!author?.id) return undefined
    return usersById[author.id] ?? author
  }

  const resolvedAuthor = resolve(post.author) ?? post.author
  const resolvedRepost = post.repostOf
    ? { ...post.repostOf, author: resolve(post.repostOf.author) ?? post.repostOf.author }
    : post.repostOf

  return {
    ...post,
    author: resolvedAuthor,
    repostOf: resolvedRepost,
  }
}

export default resolvePostAuthors
