import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gym e2e', () => {
    let tokenJWT: any;

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

    it('should be able to search for gyms', async () => {
        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${tokenJWT}`)
        .send({
            name: 'Gym1',
            description: 'Gym Description',
            phone: '123456789',
            latitude: 30,
            longitude: -40,
        })

        const response = await request(app.server)
        .get('/gyms/search')
        .set('Authorization', `Bearer ${tokenJWT}`)
        .query({ query: 'Gym1', page: 1 })
        .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('gyms')
        expect(response.body.gyms).toEqual([expect.objectContaining({ name: 'Gym1' })])
    })
})
