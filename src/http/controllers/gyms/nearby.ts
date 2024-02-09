import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearby(req: FastifyRequest, rep: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.body)

    const nearbyGymsUseCase = makeFetchNearbyGymsUseCase() 

    const { gyms } = await nearbyGymsUseCase.execute({ 
        userLatitude: latitude,
        userLongitude: longitude,
    })

    return rep.status(200).send({ gyms })
}
