const request = require('supertest');
const app = require('../app');

describe('App routes', () => {
    it('redirects root requests to API docs', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/api-docs');
    });

    it('serves the swagger specification as JSON', async () => {
        const res = await request(app).get('/api-docs.json');

        expect(res.statusCode).toBe(200);
        expect(res.type).toMatch(/json/);
        expect(res.body.info.title).toBe('Investment API');
    });

    it('returns JSON for unknown routes', async () => {
        const res = await request(app).get('/unknown-route');

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            error: 'Not Found',
            message: expect.any(String),
        });
    });
});
