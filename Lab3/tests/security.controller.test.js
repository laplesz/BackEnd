const Security = require('../models/security.model');
const controller = require('../controllers/security.controller');

jest.mock('../models/security.model');

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
});

describe('Security controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('passes getSecurities errors to next', async () => {
        const error = new Error('database unavailable');
        const req = {};
        const res = createResponse();
        const next = jest.fn();

        Security.getAll.mockRejectedValue(error);

        await controller.getSecurities(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('passes addSecurity errors to next', async () => {
        const error = new Error('insert failed');
        const req = { body: { fund_name: 'Broken Fund' } };
        const res = createResponse();
        const next = jest.fn();

        Security.create.mockRejectedValue(error);

        await controller.addSecurity(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('returns 404 when delete does not remove a fund', async () => {
        const req = { params: { id: 'Missing Fund' } };
        const res = createResponse();
        const next = jest.fn();

        Security.remove.mockResolvedValue(0);

        await controller.deleteSecurity(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
        expect(next).not.toHaveBeenCalled();
    });

    it('passes delete errors to next', async () => {
        const error = new Error('delete failed');
        const req = { params: { id: 'Broken Fund' } };
        const res = createResponse();
        const next = jest.fn();

        Security.remove.mockRejectedValue(error);

        await controller.deleteSecurity(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });
});
