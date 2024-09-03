import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './serch-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('Should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Test1',
      description: null,
      phone: null,
      latitude: -22.7630105,
      longitude: -47.4000366,
    })

    await gymsRepository.create({
      title: 'Test2',
      description: null,
      phone: null,
      latitude: -22.7630105,
      longitude: -47.4000366,
    })

    const { gyms } = await sut.execute({
      query: 'Test1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Test1' })])
  })
  it('Should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Test${i}`,
        description: null,
        phone: null,
        latitude: -22.7630105,
        longitude: -47.4000366,
      })
    }
    const { gyms } = await sut.execute({
      query: 'Test',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Test21' }),
      expect.objectContaining({ title: 'Test22' }),
    ])
  })
})
