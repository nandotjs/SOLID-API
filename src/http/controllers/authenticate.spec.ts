import { app } from '@/app'
import  request  from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })


    it('should be able to authenticate', async () => {
        await request(app.server)
        .post('/user')
        .send({
            name: "Test",
            email: "test@exmple.com",
            password: "123456",
        })

        const response = await request(app.server)
        .post('/session')
        .send({
            email: "test@exmple.com",
            password: "123456",
        })
        
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            tokenJWT: expect.any(String),
        })
    })
})