import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let imGymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('CreateGym Use Case', () => {

    beforeEach(async () => {
        imGymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(imGymsRepository)
    })

    it('should be able to create a gym', async () => {

        const { gym } = await sut.execute({
            name: 'Test',
            description: '',
            phone: '',
            latitude: -25.4217836,
            longitude: -49.2843053,
        })

        expect(gym.id).toEqual(expect.any(String))
    }) 
})