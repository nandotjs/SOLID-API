import fastify from "fastify"
import { usersRoutes } from "./http/controllers/users/routes"
import { ZodError } from "zod"
import { env } from "./env"
import fastifyJwt from "@fastify/jwt"
import { gymsRoutes } from "./http/controllers/gyms/routes"
import { checkInsRoutes } from "./http/controllers/check-ins/routes"

export const app = fastify()

// JWT
app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, req, rep) => {

    if (error instanceof ZodError) {
        return rep.status(400).send({ message: 'Validation error.', issues: error.format() })
    }

    if (env.NODE_ENV === 'production') {
        console.error(error)
    } else {
        // Log to external tool like DataDog/NewRelic/Sentry
    }

    return rep.status(500).send({ message: 'Internal server error.'})
})