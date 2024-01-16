import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository';
import { randomUUID } from 'node:crypto';


export class InMemoryCheckInsRepository implements CheckInsRepository {

    public items: CheckIn[] = []

    async create(data: Prisma.CheckInUncheckedCreateInput) {

        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            created_at: new Date(),
            validates_at: data.validates_at ? new Date(data.validates_at) : null,
        }

        this.items.push(checkIn)
        return checkIn
        
    }
}
