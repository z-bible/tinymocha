declare function describe(name: string, fn?: () => void | Promise<void>): void
declare function it(subName: string, fn?: () => void | Promise<void>): void
declare function beforeEach(fn: () => void | Promise<void>): void
declare function assertEquals<T>(a: T, b: T, message?: string): void

export { describe, it, beforeEach, assertEquals }
