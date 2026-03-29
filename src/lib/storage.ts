export function createMemoryStorage() {
  const map = new Map<string, string>()

  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value)
    },
    removeItem: (key: string) => {
      map.delete(key)
    },
  }
}

export function safeStorage() {
  if (typeof window === 'undefined') {
    return createMemoryStorage()
  }

  try {
    const probe = '__student_life_os_probe__'
    window.localStorage.setItem(probe, probe)
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return createMemoryStorage()
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const storage = safeStorage()

  try {
    const raw = storage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown) {
  const storage = safeStorage()
  storage.setItem(key, JSON.stringify(value))
}
