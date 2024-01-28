import { profile } from "./controllers/profile"
import { authenticate } from "./controllers/authenticate"
import { register } from "./controllers/register"
import { FastifyInstance } from "fastify"
import { verifyJWT } from "./controllers/middlewares/verify-jwt"


export async function appRoutes(app: FastifyInstance) {
    app.post('/user', register)
    app.post('/session', authenticate)

    // JWT //
    app.get('/me', {onRequest: [verifyJWT]}, profile)
}