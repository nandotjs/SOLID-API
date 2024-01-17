import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {

    beforeEach(async () => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(inMemoryCheckInsRepository)

        vi.useFakeTimers
    })

    afterEach(async () => {
        vi.useRealTimers
    })

    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice a day', async () => {
        vi.setSystemTime(new Date(2002, 10, 4, 6, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
        })

        await expect(() =>
        sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
        })).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2002, 10, 4, 6, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
        })

        vi.setSystemTime(new Date(2003, 10, 4, 6, 0, 0))

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})