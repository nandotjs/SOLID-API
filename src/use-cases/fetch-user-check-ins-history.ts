import { CheckIn } from "@prisma/client"
import { CheckInsRepository } from "@/repositories/check-ins-repository"


interface FetchUserCheckInsUseCaseRequest {
    userId: string
}

interface FetchUserCheckInsUseCaseResponse {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
    ) {}

    async execute({userId}: FetchUserCheckInsUseCaseRequest) : Promise<FetchUserCheckInsUseCaseResponse> {
    
        const checkIns = await this.checkInsRepository.findManyByUserId(userId)

        return {
            checkIns,
        }
    }
}