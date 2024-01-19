import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let imCheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {

    beforeEach(async () => {
        imCheckInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(imCheckInsRepository)

        // await imGymsRepository.create({
        //     id: 'gym-01',
        //     name: 'Test',
        //     description: '',
        //     phone: '',
        //     latitude: -25.4217836,
        //     longitude: -49.2843053,
        // })

        // vi.useFakeTimers
    })

    afterEach(async () => {
        // vi.useRealTimers
    })

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await imCheckInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-01'
        })

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validates_at).toEqual(expect.any(Date))
        expect(imCheckInsRepository.items[0].validates_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistet check-in', async () => {
        await expect(() => 
        sut.execute({
            checkInId: 'inexistent-check-in-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})