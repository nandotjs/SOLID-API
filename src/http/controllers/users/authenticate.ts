import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {

    const AuthenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = AuthenticateBodySchema.parse(req.body)

    try {
        const authenticateUseCase = makeAuthenticateUseCase()

        const { existingUser } = await authenticateUseCase.execute({
            email,
            password,
        })

        // JWT
        const tokenJWT = await rep.jwtSign(
            {}, 
            {
            sign: {
                sub: existingUser.id,
            }
        })

        // refresh Token
        const refreshToken = await rep.jwtSign(
            {}, 
            {
            sign: {
                sub: existingUser.id,
                expiresIn: '7d',
            }
        })

        return rep.status(200)
        .setCookie('refreshToken', refreshToken, {
            path:'/',
            secure: true,
            sameSite: true,
            httpOnly: true,
        })
        .send({tokenJWT})

    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return rep.status(400).send({ message: error.message})
        }
        throw error
    } 
}