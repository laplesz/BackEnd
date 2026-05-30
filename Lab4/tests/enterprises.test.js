const request = require('supertest');

jest.mock('../models/enterprise.model', () => {
    const Enterprise = jest.fn();
    Enterprise.find = jest.fn();
    Enterprise.findOneAndDelete = jest.fn();

    return { Enterprise };
});

const app = require('../app');
const { Enterprise } = require('../models/enterprise.model');

const enterprisePayload = {
    enterprise_name: 'Acme Manufacturing',
    type_of_ownership: 'LLC',
    address: '42 Industrial Ave',
    tel_number: '+380501234567',
};

describe('Enterprise routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Enterprise.mockImplementation(data => ({
            ...data,
            save: jest.fn().mockResolvedValue({
                _id: '665f1f77bcf86cd799439011',
                ...data,
            }),
        }));
    });

    describe('GET /enterprises', () => {
        it('returns all enterprises', async () => {
            const enterprises = [
                { _id: '665f1f77bcf86cd799439011', ...enterprisePayload },
                {
                    _id: '665f1f77bcf86cd799439012',
                    enterprise_name: 'Blue River Logistics',
                },
            ];
            Enterprise.find.mockResolvedValue(enterprises);

            const res = await request(app).get('/enterprises');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(enterprises);
            expect(Enterprise.find).toHaveBeenCalledTimes(1);
        });

        it('returns 500 when enterprises cannot be loaded', async () => {
            Enterprise.find.mockRejectedValue(new Error('database is unavailable'));

            const res = await request(app).get('/enterprises');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: 'database is unavailable' });
        });
    });

    describe('POST /enterprises/new', () => {
        it('creates an enterprise', async () => {
            const res = await request(app).post('/enterprises/new').send(enterprisePayload);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({
                _id: '665f1f77bcf86cd799439011',
                ...enterprisePayload,
            });
            expect(Enterprise).toHaveBeenCalledWith(enterprisePayload);
        });

        it('returns 400 when the enterprise is invalid', async () => {
            Enterprise.mockImplementation(data => ({
                ...data,
                save: jest.fn().mockRejectedValue(new Error('enterprise_name is required')),
            }));

            const res = await request(app).post('/enterprises/new').send({ address: 'No name' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: 'enterprise_name is required' });
        });
    });

    describe('DELETE /enterprises/:id', () => {
        it('deletes an existing enterprise', async () => {
            const id = '665f1f77bcf86cd799439011';
            Enterprise.findOneAndDelete.mockResolvedValue({ _id: id, ...enterprisePayload });

            const res = await request(app).delete(`/enterprises/${id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(Enterprise.findOneAndDelete).toHaveBeenCalledWith({ _id: id });
        });

        it('returns 404 when the enterprise does not exist', async () => {
            Enterprise.findOneAndDelete.mockResolvedValue(null);

            const res = await request(app).delete('/enterprises/665f1f77bcf86cd799439099');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
        });

        it('returns 500 when delete fails', async () => {
            Enterprise.findOneAndDelete.mockRejectedValue(new Error('delete failed'));

            const res = await request(app).delete('/enterprises/not-a-valid-id');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: 'delete failed' });
        });
    });
});
