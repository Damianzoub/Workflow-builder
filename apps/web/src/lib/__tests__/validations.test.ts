import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, forgotPasswordSchema } from '../validations'

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' })
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '123' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      name: 'Test User', email: 'a@b.com',
      password: 'secret123', confirmPassword: 'secret123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Test User', email: 'a@b.com',
      password: 'secret123', confirmPassword: 'different',
    })
    expect(result.success).toBe(false)
  })

  it('rejects name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({
      name: 'A', email: 'a@b.com',
      password: 'secret123', confirmPassword: 'secret123',
    })
    expect(result.success).toBe(false)
  })
})

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'a@b.com' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'bad' })
    expect(result.success).toBe(false)
  })
})
