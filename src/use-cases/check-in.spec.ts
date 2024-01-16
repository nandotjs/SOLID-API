import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {

    beforeEach(async () => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(inMemoryCheckInsRepository)
    })

    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})