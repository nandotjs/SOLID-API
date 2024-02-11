import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { CheckIn } from '@prisma/client';

describe('History e2e', () => {
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

    it('should be able to list the history of check-ins', async () => {
        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                name: 'Gym Name',
                description: 'Gym Description',
                phone: '123456789',
                latitude: -25.4217836,
                longitude: -49.2843053,
            }
        })

        const checkIns = await prisma.checkIn.createMany({
            data: [
                {
                    gym_id:gym.id,
                    user_id:user.id
                },
                {
                    gym_id:gym.id,
                    user_id:user.id
                }
            ]
        })
            
        const response = await request(app.server)
        .get('/check-ins/history')
        .set('Authorization', `Bearer ${tokenJWT}`)
        .send()
        
        expect(response.statusCode).toEqual(200)
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                gym_id: gym.id,
                user_id: user.id
            }),
            expect.objectContaining({
                gym_id: gym.id,
                user_id: user.id
            })
        ])
    })
})
