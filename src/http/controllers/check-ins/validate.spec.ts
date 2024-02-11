import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Validate Check-In e2e', () => {
    let tokenJWT: any

    beforeAll(async () => {
        await app.ready()

        await request(app.server)
        .post('/user')
        .send({
            name: "Test",
            email: "test@example.com",
            password: "123456",
        })

        const auth = await request(app.server)
        .post('/session')
        .send({
            email: "test@example.com",
            password: "123456",
        })

        tokenJWT = auth.body.tokenJWT
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to validate a check-in', async () => {
        const gym = await prisma.gym.create({
            data: {
                name: 'Gym Name',
                description: 'Gym Description',
                phone: '123456789',
                latitude: -25.4217836,
                longitude: -49.2843053,
            }
        })

        await request(app.server)
        .post(`/gyms/${gym.id}/check-ins`)
        .set('Authorization', `Bearer ${tokenJWT}`)
        .send({
            latitude: -25.4217836,
            longitude: -49.2843053,
        })

        const checkIn = await prisma.checkIn.findFirstOrThrow()

        const response = await request(app.server)
        .patch(`/check-ins/${checkIn.id}/validate`)
        .set('Authorization', `Bearer ${tokenJWT}`)
        .send({
            checkInId: checkIn.id
        })
        
        expect(response.statusCode).toEqual(204)    
    })
})
