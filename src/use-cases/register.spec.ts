import { describe, it, expect } from 'vitest'
import { RegisterUseCase} from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
    it('shoul hash user password', async () => {
        
        const registerUseCase = new RegisterUseCase({

            async create(data) {
                return{
                    id: 'user-1',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash
                }
            },

            async findByEmail(email) {
                return null
            }
        })

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