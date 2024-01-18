import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';
import { SearchGymUseCase } from './search-gym';

let imGymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gym Use Case', () => {

    beforeEach(async () => {
        imGymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymUseCase(imGymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await imGymsRepository.create({
            name: 'TestGym',
            description: '',
            phone: '',
            latitude: -25.4217836,
            longitude: -49.2843053,
        })

        await imGymsRepository.create({
            name: 'TestGym2',
            description: '',
            phone: '',
            latitude: -25.4217836,
            longitude: -49.2843053,
        })

        const { gyms } = await sut.execute({
            query: 'TestGym2',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({name: 'TestGym2'})])
    }) 

    it('should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await imGymsRepository.create({
                name: `TestGym ${i}`,
                description: '',
                phone: '',
                latitude: -25.4217836,
                longitude: -49.2843053,
            })
        }

        const { gyms } = await sut.execute({
            query: 'TestGym',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ name: 'TestGym 21' }),
            expect.objectContaining({ name: 'TestGym 22' }),
        ])
    })
})