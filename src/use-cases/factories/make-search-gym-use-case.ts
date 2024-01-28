import { SearchGymUseCase } from "../search-gym"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"

export function makeSearchGymUseCase() {
    const prismaGymsRepository = new PrismaGymsRepository()
    const useCase = new SearchGymUseCase(prismaGymsRepository)
    return useCase
}