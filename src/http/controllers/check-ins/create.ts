import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(req: FastifyRequest, rep: FastifyReply) {
    const createCheckInsParamsSchema = z.object({
        gymId: z.string().uuid()
    })

    const CreateCheckInBodySchema = z.object({
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { gymId } = createCheckInsParamsSchema.parse(req.params)
    const { latitude, longitude } = CreateCheckInBodySchema.parse(req.body)

    const checkInUseCase = makeCheckInUseCase() 

    await checkInUseCase.execute({ 
        userId: req.user.sub,
        gymId,
        userLatitude: latitude,
        userLongitude: longitude,
    })
    
    return rep.status(201).send()
}
