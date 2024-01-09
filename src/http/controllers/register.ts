import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';

export async function register(req: FastifyRequest, rep: FastifyReply) {
    
    const RegisterBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = RegisterBodySchema.parse(req.body)

    try {
        const prismaUsersRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(prismaUsersRepository)

        await registerUseCase.execute({
            name,
            email,
            password,
        })
    } catch (error) {
            return rep.status(409).send()
    }

    return rep.status(201).send()
}
    
