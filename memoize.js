function memoize(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function')
  }
  const memoized = function(...args) {
    const key = args[0]
    const cache = memoized.cache
    if (cache.has(key)) {
      return cache.get(key)
    }
    const res = fn.apply(this, args)
    memoized.cache = cache.set(key, res)
    return res
  }
  memoized.cache = new Map()
  return memoized
}