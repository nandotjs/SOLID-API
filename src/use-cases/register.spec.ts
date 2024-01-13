import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterUseCase} from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {

    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(inMemoryUsersRepository)
    })

    it('should be able to register', async () => {

        const { user } = await sut.execute({
            name: 'Test',
            email: 'test@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })
    
    it('should not be able to register with same email twice', async () => {

        await sut.execute({
            name: 'Test',
            email: 'test@example.com',
            password: '123456'
        })

        await expect(() => 
            sut.execute({
                name: 'Test',
                email: 'test@example.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)

    })

    it('should hash user password', async () => {

        const { user } = await sut.execute({
            name: 'Test',
            email: 'test@example.com',
            password: '123456'
        })

        const isPasswordHashed = await compare(
            '123456',
            user.password_hash
        )

        expect(isPasswordHashed).toBe(true)
    })
    
})