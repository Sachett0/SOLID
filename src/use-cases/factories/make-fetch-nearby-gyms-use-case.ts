import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const checkInsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyUseCase(checkInsRepository)

  return useCase
}
