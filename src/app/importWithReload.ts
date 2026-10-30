const RELOAD_FLAG = 'sevens:chunk-reloaded'

function hasReloaded(): boolean {
  try {
    return sessionStorage.getItem(RELOAD_FLAG) === '1'
  } catch {
    return false
  }
}

function setReloaded(value: boolean): void {
  try {
    if (value) sessionStorage.setItem(RELOAD_FLAG, '1')
    else sessionStorage.removeItem(RELOAD_FLAG)
  } catch {
    // Storage can be unavailable in private windows; reloading still helps.
  }
}

/**
 * Wraps a dynamic import so that a chunk that fails to load reloads the page once.
 *
 * The usual cause is a deploy while this tab was open: the hashed file names in
 * the loaded index.html no longer exist, so the first visit to a lazy route fails.
 * A reload fetches the new index.html and the matching chunks. The flag stops a
 * genuinely broken build from reloading forever.
 */
export function importWithReload<T>(
  load: () => Promise<T>,
  reload: () => void = () => window.location.reload(),
): () => Promise<T> {
  return async () => {
    try {
      const loaded = await load()
      setReloaded(false)
      return loaded
    } catch (error) {
      if (hasReloaded()) throw error
      setReloaded(true)
      reload()
      // The page is reloading; leave the Suspense fallback up rather than flash the error page.
      return new Promise<T>(() => {})
    }
  }
}
