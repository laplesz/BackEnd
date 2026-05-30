const EventEmitter = require('events');
const statsEmitter = require('../events/statsEmitter');
const statsLogger = require('../middlewares/statsLogger');
const timingAndRateLimit = require('../middlewares/timingRateLimit');

jest.mock('../events/statsEmitter', () => ({
    emit: jest.fn(),
}));

describe('statsLogger middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('emits masked request stats when response finishes', () => {
        const res = new EventEmitter();
        res.statusCode = 201;
        const req = {
            method: 'POST',
            path: '/security',
            params: { token: 'secret-token', id: 'safe-id' },
            query: { email: 'user@example.com', page: '1' },
            get: jest.fn().mockReturnValue('jest-agent'),
        };
        const next = jest.fn();

        statsLogger(req, res, next);
        res.emit('finish');

        expect(next).toHaveBeenCalled();
        expect(statsEmitter.emit).toHaveBeenCalledWith(
            'requestCompleted',
            expect.objectContaining({
                method: 'POST',
                path: '/security',
                userAgent: 'jest-agent',
                params: { token: '***', id: 'safe-id' },
                query: { email: '***', page: '1' },
                status: 201,
            }),
        );
    });
});

describe('timingAndRateLimit middleware', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('sets response time header for successful responses', () => {
        const req = { ip: 'success-ip' };
        const originalSend = jest.fn().mockReturnValue('sent');
        const res = {
            statusCode: 200,
            setHeader: jest.fn(),
            send: originalSend,
        };
        const next = jest.fn(() => {
            res.send('ok');
        });

        const result = timingAndRateLimit(req, res, next);

        expect(result).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(res.setHeader).toHaveBeenCalledWith(
            'X-Response-Time',
            expect.stringMatching(/^\d+\.\d{3}ms$/),
        );
        expect(originalSend).toHaveBeenCalledWith('ok');
    });

    it('does not set response time header for error responses', () => {
        const req = { ip: 'error-ip' };
        const res = {
            statusCode: 500,
            setHeader: jest.fn(),
            send: jest.fn().mockReturnValue('sent'),
        };
        const next = jest.fn(() => {
            res.send('error');
        });

        timingAndRateLimit(req, res, next);

        expect(res.setHeader).not.toHaveBeenCalled();
    });

    it('returns 429 after too many requests from the same ip', () => {
        const req = { ip: 'limited-ip' };
        const createRes = () => ({
            statusCode: 200,
            setHeader: jest.fn(),
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        });
        const next = jest.fn();
        let lastRes;

        for (let i = 0; i < 51; i += 1) {
            lastRes = createRes();
            timingAndRateLimit(req, lastRes, next);
        }

        expect(lastRes.status).toHaveBeenCalledWith(429);
        expect(lastRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
        expect(next).toHaveBeenCalledTimes(50);
    });

    it('starts a new rate-limit window after reset time passes', () => {
        jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(62001);
        const req = { ip: 'reset-ip' };
        const res = {
            statusCode: 200,
            setHeader: jest.fn(),
            send: jest.fn(),
        };
        const next = jest.fn();

        timingAndRateLimit(req, res, next);
        timingAndRateLimit(req, res, next);

        expect(next).toHaveBeenCalledTimes(2);
    });
});
