import { describe, it, expect } from 'vitest'
import { sortWorkflows } from '../sort-workflows'
import { mockWorkflows } from '@/mock/workflows'

describe('sortWorkflows', () => {
  it('sorts by name ascending', () => {
    const result = sortWorkflows(mockWorkflows, 'name', 'asc')
    expect(result[0].name).toBe('Booking Agent')
    expect(result[result.length - 1].name).toBe('Support Bot')
  })

  it('sorts by name descending', () => {
    const result = sortWorkflows(mockWorkflows, 'name', 'desc')
    expect(result[0].name).toBe('Support Bot')
  })

  it('sorts by createdAt ascending (oldest first)', () => {
    const result = sortWorkflows(mockWorkflows, 'createdAt', 'asc')
    expect(result[0].createdAt).toBe('2026-05-05')
  })

  it('sorts by modifiedAt descending (newest first)', () => {
    const result = sortWorkflows(mockWorkflows, 'modifiedAt', 'desc')
    expect(result[0].modifiedAt).toBe('2026-05-11')
  })

  it('does not mutate the original array', () => {
    const original = [...mockWorkflows]
    sortWorkflows(mockWorkflows, 'name', 'asc')
    expect(mockWorkflows[0]).toEqual(original[0])
  })
})
