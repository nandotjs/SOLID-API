import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validate(req: FastifyRequest, rep: FastifyReply) {
    const validateCheckinParamsSchema = z.object({
        checkInId: z.string().uuid()
    })

    const { checkInId } = validateCheckinParamsSchema.parse(req.params)

    const validateCheckInUseCase = makeValidateCheckInUseCase()

    await validateCheckInUseCase.execute({ 
        checkInId
    })
        
    return rep.status(204).send()
}
