import { profile } from "./profile"
import { authenticate } from "./authenticate"
import { register } from "./register"
import { FastifyInstance } from "fastify"
import { verifyJWT } from "../../middlewares/verify-jwt"
import { refresh } from "./refresh"


export async function usersRoutes(app: FastifyInstance) {
    app.post('/user', register)
    app.post('/session', authenticate)

    app.patch('/token/refresh', refresh)

    // JWT //
    app.get('/me', {onRequest: [verifyJWT]}, profile)
}