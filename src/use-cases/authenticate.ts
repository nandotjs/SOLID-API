import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";

interface AuthenticateUseCaseRequest {
    email: string,
    password: string,
}

interface AuthenticateUseCaseResponse {
    existingUser: User
}

export class AuthenticateUseCase {
    constructor(private usersRepository: UsersRepository) {}
    
    async execute({email, password}: AuthenticateUseCaseRequest) : Promise<AuthenticateUseCaseResponse> {

        const existingUser = await this.usersRepository.findByEmail(email)

        if(!existingUser) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatches = await compare(
            password,
            existingUser.password_hash
        )

        if(!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return {existingUser}
        
    }
}