// Utility to build a non-repeating ad index sequence for feed slots.
// review logic

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

const createAdSequence = (
  count: number,
  slots: number,
  seed = Math.floor(Math.random() * 1_000_000_000)
) => {
  if (count <= 0 || slots <= 0) return [] as number[]

  const targetLength = Math.max(count, slots)
  if (count === 1) return new Array(targetLength).fill(0)

  const start = seed % count
  let step = (seed % (count - 1)) + 1
  while (gcd(step, count) !== 1) {
    step = (step % (count - 1)) + 1
  }

  const base: number[] = new Array(count)
  for (let i = 0; i < count; i++) base[i] = (start + i * step) % count

  const seq: number[] = []
  let rotation = 0
  while (seq.length < targetLength) {
    const r = rotation % count
    const rotated = base.slice(r).concat(base.slice(0, r))
    seq.push(...rotated)
    rotation++
  }

  return seq.slice(0, targetLength)
}

export default createAdSequence
