import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

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
        if (error instanceof UserAlreadyExistsError) {
            return rep.status(409).send({ message: error.message})
        }
        throw error
    }

    return rep.status(201).send()
}
    
