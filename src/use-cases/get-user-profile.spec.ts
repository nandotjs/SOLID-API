import { describe, it, expect, beforeEach } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('GetUserProfile Use Case', () => {

    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(inMemoryUsersRepository)
    })

    it('should be able to get user profile', async () => {

        const createdUser = await inMemoryUsersRepository.create({
            name: 'Test',
            email: 'test@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('Test')

    })

    it('should not be able to get user profile with wrong id', async () => {
        await expect(() => 
            sut.execute({
                userId: 'non-exintng-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})