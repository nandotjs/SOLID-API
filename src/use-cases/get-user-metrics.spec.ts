import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from './../repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxCheckInsError } from './errors/max-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'
import { GetUserMetricsUseCase } from './get-user-metrics'


let imCheckInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
    beforeEach(async () => {
        imCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new GetUserMetricsUseCase(imCheckInsRepository)
    })

    it('should be able to get check-ins count from metrics', async () => {
        await imCheckInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-01',
        })

        const {checkInsCount} = await sut.execute({
            userId: 'user-01',
        })

        expect(checkInsCount).toEqual(1)
    })
})