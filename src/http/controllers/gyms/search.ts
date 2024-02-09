import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymUseCase } from '@/use-cases/factories/make-search-gym-use-case'
import { z } from 'zod'

export async function search(req: FastifyRequest, rep: FastifyReply) {
    const searchGymsQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    })

    const { query, page } = searchGymsQuerySchema.parse(req.query)

    const searchGymUseCase = makeSearchGymUseCase() 

    const { gyms } = await searchGymUseCase.execute({ 
        query,
        page,
    })

    return rep.status(200).send({ gyms })
}
