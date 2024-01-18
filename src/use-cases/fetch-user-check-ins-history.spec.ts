import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from './../repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxCheckInsError } from './errors/max-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history'

let imCheckInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsUseCase

describe('Fetch user check-ins history Use Case', () => {

    beforeEach(async () => {
        imCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new FetchUserCheckInsUseCase(imCheckInsRepository)
    })

    it('should be able to fetch check-in history', async () => {
        await imCheckInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-01',
        })

        await imCheckInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-02',
        })

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 1,
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-01' }),
            expect.objectContaining({ gym_id: 'gym-02' }),
        ])
    })

    it('should be able to fetch paginated check-in history', async () => {
        for (let i = 1; i <= 22; i++) {
            await imCheckInsRepository.create({
                user_id: 'user-01',
                gym_id: `gym-${i}`,
            })
        }

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 2,
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' }),
        ])
    })
})