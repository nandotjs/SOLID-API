import { describe, it, expect, beforeEach } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {

    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(inMemoryUsersRepository)
    })

    it('should be able to authenticate', async () => {

        await inMemoryUsersRepository.create({
            name: 'Test',
            email: 'test@example.com',
            password_hash: await hash('123456', 6)
        })

        const { existingUser } = await sut.execute({
            email: 'test@example.com',
            password: '123456'
        })

        expect(existingUser.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {

        await expect(() => sut.execute({
            email: 'test@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {

        await inMemoryUsersRepository.create({
            name: 'Test',
            email: 'test@example.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() => sut.execute({
            email: 'test@example.com',
            password: '654321'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})