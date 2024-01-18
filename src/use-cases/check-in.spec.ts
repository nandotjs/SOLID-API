import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from './../repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxCheckInsError } from './errors/max-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let imCheckInsRepository: InMemoryCheckInsRepository
let imGymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {

    beforeEach(async () => {
        imCheckInsRepository = new InMemoryCheckInsRepository()
        imGymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(imCheckInsRepository, imGymsRepository)

        await imGymsRepository.create({
            id: 'gym-01',
            name: 'Test',
            description: '',
            phone: '',
            latitude: -25.4217836,
            longitude: -49.2843053,
        })

        vi.useFakeTimers
    })

    afterEach(async () => {
        vi.useRealTimers
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -25.4217836,
            userLongitude: -49.2843053,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice a day', async () => {
        vi.setSystemTime(new Date(2002, 10, 4, 6, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -25.4217836,
            userLongitude: -49.2843053,
        })

        await expect(() =>
        sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -25.4217836,
            userLongitude: -49.2843053,
        })).rejects.toBeInstanceOf(MaxCheckInsError)
    })

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2002, 10, 4, 6, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -25.4217836,
            userLongitude: -49.2843053,
        })

        vi.setSystemTime(new Date(2003, 10, 4, 6, 0, 0))

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -25.4217836,
            userLongitude: -49.2843053,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async () => {
        imGymsRepository.items.push({
            id: 'gym-02',
            name: 'jsGym',
            description: '',
            phone: '',
            latitude: new Decimal(-25.4217836),
            longitude:new Decimal(-49.290568),
        })

        await expect(() => 
        sut.execute({
            userId: 'user-01',
            gymId: 'gym-02',
            userLatitude: -25.4217836,
            userLongitude: -49.2843053,
        })).rejects.toBeInstanceOf(MaxDistanceError)
    })
})