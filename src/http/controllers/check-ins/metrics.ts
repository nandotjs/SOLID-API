import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(req: FastifyRequest, rep: FastifyReply) {
    const getUserMetricsUseCase = makeGetUserMetricsUseCase() 

    const { checkInsCount } = await getUserMetricsUseCase.execute({ 
        userId: req.user.sub,
    })

    return rep.status(200).send({ checkInsCount })
}
