import { CheckIn } from "@prisma/client"
import { CheckInsRepository } from "@/repositories/check-ins-repository"
import { GymsRepository } from "@/repositories/gyms-repository"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates"
import { MaxDistanceError } from "./errors/max-distance-error"
import { MaxCheckInsError } from "./errors/max-check-ins-error"
import defineConfig from './../../vite.config';
import dayjs from "dayjs"
import { LateCheckInError } from "./errors/late-check-in-error"


interface ValidateCheckInUseCaseRequest {
    checkInId: string
}

interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn
}

export class ValidateCheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository
    ) {}

    async execute({checkInId}: ValidateCheckInUseCaseRequest) : Promise<ValidateCheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId)

        if(!checkIn) {
            throw new ResourceNotFoundError()
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes'
        )

        if(distanceInMinutesFromCheckInCreation > 20) {
            throw new LateCheckInError()
        }

        checkIn.validates_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return {
            checkIn
        }
    }
}