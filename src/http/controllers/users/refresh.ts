import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(req: FastifyRequest, rep: FastifyReply) {
    await req.jwtVerify({ onlyCookie: true })

    const { role } = req.user

    // JWT
    const tokenJWT = await rep.jwtSign(
        { role }, 
        {
        sign: {
            sub: req.user.sub,
        }
    })

    // refresh Token
    const refreshToken = await rep.jwtSign(
        { role }, 
        {
        sign: {
            sub: req.user.sub,
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
}