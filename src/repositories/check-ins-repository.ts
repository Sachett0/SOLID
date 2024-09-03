import { Prisma, checkIn } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.checkInUncheckedCreateInput): Promise<checkIn>
  save(checkIn: checkIn): Promise<checkIn>
  findManyByUserId(userId: string, page: number): Promise<checkIn[]>
  findByUserIdOnDate(userId: string, date: Date): Promise<checkIn | null>
  countByUserId(userId: string): Promise<number>
  findById(id: string): Promise<checkIn | null>
}
