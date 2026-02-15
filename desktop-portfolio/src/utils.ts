/* ============================================================
   Shared Utility Functions
   ============================================================ */

/** Clamp a number between min and max */
export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi)
}

/** Generate a short unique id */
export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

/** Safe JSON parse — returns null on failure */
export function safeParse<T = unknown>(str: string | null): T | null {
  if (!str) return null
  try {
    return JSON.parse(str) as T
  } catch {
    return null
  }
}

/** Debounce utility — delays invocation until `ms` after last call */
export function debounce<A extends unknown[]>(
  fn : (...args: A) => void,
  ms : number,
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: A) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

/** Format seconds to m:ss */
export function formatTime(s: number): string {
  const m   = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}
