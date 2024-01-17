import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { CheckIn } from "@prisma/client"
import { CheckInsRepository } from "@/repositories/check-ins-repository"


interface CheckInUseCaseRequest {
    userId: string
    gymId: string
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({userId, gymId}: CheckInUseCaseRequest) : Promise<CheckInUseCaseResponse> {

        const checkInOnSameDate = await this.checkInsRepository.findUserIdOnDate(
            userId,
            new Date()
        )

        if(checkInOnSameDate) {
            throw new Error
        }
    
        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId,
        })

        return {
            checkIn
        }
    }
}