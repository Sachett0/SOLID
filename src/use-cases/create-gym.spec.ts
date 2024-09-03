import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })
  it('Should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym Test',
      description: null,
      phone: null,
      latitude: -22.7630105,
      longitude: -47.4000366,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
