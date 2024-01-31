import { app } from '@/app'
import  request  from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })


    it('should be able to get user profile', async () => {
        await request(app.server)
        .post('/user')
        .send({
            name: "Test",
            email: "test@example.com",
            password: "123456",
        })

        const response = await request(app.server)
        .post('/session')
        .send({
            email: "test@example.com",
            password: "123456",
        })

        const { tokenJWT } = response.body

        const profileResponse = await request(app.server)
        .get('/me')
        .set('Authorization', `Bearer ${tokenJWT}`)
        .send()
        
        expect(profileResponse.statusCode).toEqual(200)
        expect(profileResponse.body.user).toEqual(expect.objectContaining({
            email: 'test@example.com'
        }))
    })
})