import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym e2e', () => {
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

    it('should be able to create a gym', async () => {
        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${tokenJWT}`)
            .send({
                name: 'Gym Name',
                description: 'Gym Description',
                phone: '123456789',
                latitude: -25.4217836,
                longitude: -49.2843053,
            })

        expect(response.statusCode).toEqual(201)
    })
})
