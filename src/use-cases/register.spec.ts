import { describe, it, expect } from 'vitest'
import { RegisterUseCase} from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';


describe('Register Use Case', () => {

    it('should be able to register', async () => {
        
        const inMemoryusersRepository = new InMemoryUsersRepository
        const registerUseCase = new RegisterUseCase(inMemoryusersRepository)

        const { user } = await registerUseCase.execute({
            name: 'Test',
            email: 'test@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })
    
    it('should not be able to register with same email twice', async () => {
        
        const inMemoryusersRepository = new InMemoryUsersRepository
        const registerUseCase = new RegisterUseCase(inMemoryusersRepository)

        await registerUseCase.execute({
            name: 'Test',
            email: 'test@example.com',
            password: '123456'
        })

        await expect(() => 
            registerUseCase.execute({
                name: 'Test',
                email: 'test@example.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)

    })

    it('should hash user password', async () => {
        
        const inMemoryusersRepository = new InMemoryUsersRepository
        const registerUseCase = new RegisterUseCase(inMemoryusersRepository)

        const { user } = await registerUseCase.execute({
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