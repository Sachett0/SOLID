import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumerOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Test',
      description: '',
      phone: '',
      latitude: -22.7630105,
      longitude: -47.4000366,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7630105,
      userLongitude: -47.4000366,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 5, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7630105,
      userLongitude: -47.4000366,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.7630105,
        userLongitude: -47.4000366,
      }),
    ).rejects.toBeInstanceOf(MaxNumerOfCheckInsError)
  })

  it('Should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 5, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7630105,
      userLongitude: -47.4000366,
    })

    vi.setSystemTime(new Date(2024, 5, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7630105,
      userLongitude: -47.4000366,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in on distant', async () => {
    // -22.6984124,-47.2933491
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Test',
      description: '',
      phone: '',
      latitude: new Decimal(-22.6984124),
      longitude: new Decimal(-47.2933491),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.7630105,
        userLongitude: -47.4000366,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
