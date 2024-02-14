import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(req: FastifyRequest, rep: FastifyReply) {
    await req.jwtVerify({ onlyCookie: true })

    // JWT
    const tokenJWT = await rep.jwtSign(
        {}, 
        {
        sign: {
            sub: req.user.sub,
        }
    })

    // refresh Token
    const refreshToken = await rep.jwtSign(
        {}, 
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