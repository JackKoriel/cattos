import { describe, it, expect } from 'vitest'
import { generateTempId, createTempPost, createTempComment } from '../optimistic'

describe('optimistic utilities', () => {
  it('generateTempId produces unique strings', () => {
    const a = generateTempId()
    const b = generateTempId()
    expect(a).not.toBe(b)
    expect(a).toMatch(/^temp-/)
  })

  it('createTempPost returns a valid Post-like object', () => {
    const author = { id: 'u1', username: 'cat', displayName: 'Cat', avatar: undefined }
    const post = createTempPost({ author, content: 'hi', mediaUrls: ['a.mp4'] })
    expect(post.id).toBeDefined()
    expect(post.authorId).toBe(author.id)
    expect(post.author).toEqual({
      id: 'u1',
      username: 'cat',
      displayName: 'Cat',
      avatar: undefined,
    })
    expect(post.content).toBe('hi')
    expect(post.mediaUrls).toEqual(['a.mp4'])
    expect(typeof post.createdAt).toBe('string')
  })

  it('createTempComment delegates to createTempPost and sets parentPostId', () => {
    const author = { id: 'u2', username: 'meow', displayName: 'Meow' }
    const comment = createTempComment({ author, content: 'nice', parentPostId: 'p1' })
    expect(comment.parentPostId).toBe('p1')
    expect(comment.authorId).toBe('u2')
    expect(comment.content).toBe('nice')
  })
})
