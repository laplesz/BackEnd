const request = require('supertest');
const app = require('../app');

describe('Security API Tests', () => {
    it('GET /security - має повертати список фондів', async () => {
        const res = await request(app).get('/security');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /security - має додавати новий фонд', async () => {
        const newFund = {
            fund_name: 'Test Fund',
            rating: 5,
            profitability_for_the_previous_year: 10.0,
            min_transaction_amount: 1000,
            marketability: 'Висока',
        };
        const res = await request(app).post('/security').send(newFund);
        expect(res.statusCode).toEqual(201);
        expect(res.body.fund_name).toEqual('Test Fund');
    });

    it('DELETE /security/:id - має видаляти фонд', async () => {
        const res = await request(app).delete('/security/Test Fund');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('успішно');
    });
});
