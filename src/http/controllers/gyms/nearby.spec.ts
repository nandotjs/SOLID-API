import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Nearby Gyms e2e', () => {
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

    it('should be fetch nearby gyms', async () => {
        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${tokenJWT}`)
        .send({
            name: 'Near Gym',
            description: '',
            phone: '',
            latitude: -25.4217836,
            longitude: -49.2843053,
        })

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${tokenJWT}`)
        .send({
            name: 'Far Gym',
            description: '',
            phone: '',
            latitude: -25.5300784,
            longitude: -48.5201392,
        })

        const response = await request(app.server)
        .get('/gyms/nearby')
        .set('Authorization', `Bearer ${tokenJWT}`)
        .query({ latitude: -25.4217836, longitude: -49.2843053 })
        .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('gyms')
        expect(response.body.gyms).toEqual([
            expect.objectContaining({name: 'Near Gym'})
        ])
    })
})
