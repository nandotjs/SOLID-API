import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(req: FastifyRequest, rep: FastifyReply) {

    const RegisterBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = RegisterBodySchema.parse(req.body)

    try {
        const registerUseCase = makeRegisterUseCase()

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