import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let imGymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {

    beforeEach(async () => {
        imGymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(imGymsRepository)
    })

    it('should be able fetch neraby gyms', async () => {
        await imGymsRepository.create({
            name: 'Near Gym',
            description: '',
            phone: '',
            latitude: -25.4217836,
            longitude: -49.2843053,
        })
        
        await imGymsRepository.create({
            name: 'Far Gym',
            description: '',
            phone: '',
            latitude: -25.5300784,
            longitude: -48.5201392,
        })

        const { gyms } = await sut.execute({
            userLatitude: -25.4217836,
            userLongitude: -49.2843053,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({name: 'Near Gym'})])
    }) 
})