import { FetchUserCheckInsUseCase } from "../fetch-user-check-ins-history"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"

export function makeFetchUserCheckInsUseCase() {
    const prismaCheckInsRepository = new PrismaCheckInsRepository()
    const useCase = new FetchUserCheckInsUseCase(prismaCheckInsRepository)
    return useCase
}