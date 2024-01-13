import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '@/use-cases/authenticate';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {

    const AuthenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = AuthenticateBodySchema.parse(req.body)

    try {
        const prismaUsersRepository = new PrismaUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

        await authenticateUseCase.execute({
            email,
            password,
        })
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return rep.status(400).send({ message: error.message})
        }
        throw error
    }

    return rep.status(200).send()
}
    