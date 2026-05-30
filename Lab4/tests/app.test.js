const request = require('supertest');

jest.mock('../models/enterprise.model', () => ({
    Enterprise: {
        find: jest.fn(),
        findOneAndDelete: jest.fn(),
    },
}));

const app = require('../app');

const routerKey = '_router';
const findFinalMiddleware = arity =>
    [...app[routerKey].stack].reverse().find(layer => !layer.route && layer.handle.length === arity)
        .handle;

describe('App routes and error handling', () => {
    it('renders the home page', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Express');
    });

    it('forwards unknown routes to the 404 error handler', () => {
        const notFoundMiddleware = findFinalMiddleware(3);
        const next = jest.fn();

        notFoundMiddleware({}, {}, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
    });

    it('renders an error response without exposing details outside development', () => {
        const errorMiddleware = findFinalMiddleware(4);
        const error = new Error('Something failed');
        const req = { app: { get: jest.fn().mockReturnValue('test') } };
        const res = {
            locals: {},
            status: jest.fn().mockReturnThis(),
            render: jest.fn(),
        };

        errorMiddleware(error, req, res, jest.fn());

        expect(res.locals).toEqual({
            message: 'Something failed',
            error: {},
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.render).toHaveBeenCalledWith('error');
    });

    it('exposes error details in development', () => {
        const errorMiddleware = findFinalMiddleware(4);
        const error = Object.assign(new Error('Not found'), { status: 404 });
        const req = { app: { get: jest.fn().mockReturnValue('development') } };
        const res = {
            locals: {},
            status: jest.fn().mockReturnThis(),
            render: jest.fn(),
        };

        errorMiddleware(error, req, res, jest.fn());

        expect(res.locals).toEqual({
            message: 'Not found',
            error,
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.render).toHaveBeenCalledWith('error');
    });
});
