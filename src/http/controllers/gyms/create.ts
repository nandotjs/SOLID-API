import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(req: FastifyRequest, rep: FastifyReply) {
    const CreateGymBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        phone: z.string(),
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { name, description, phone, latitude, longitude } = CreateGymBodySchema.parse(req.body)

    const createGymUseCase = makeCreateGymUseCase() 

    await createGymUseCase.execute({ 
        name,
        description,
        phone,
        latitude,
        longitude,
    })
        
    return rep.status(201).send()   
}
