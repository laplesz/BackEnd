/* eslint-disable global-require */

describe('loggerSubscriber', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.dontMock('fs');
    });

    it('recovers from invalid stats JSON before writing the new event', () => {
        const writeFileSync = jest.fn();

        jest.doMock('fs', () => ({
            existsSync: jest.fn().mockReturnValue(true),
            readFileSync: jest.fn().mockReturnValue('{bad json'),
            writeFileSync,
        }));

        require('../subscribers/loggerSubscriber');
        const statsEmitter = require('../events/statsEmitter');
        const stats = {
            method: 'GET',
            path: '/security',
            status: 200,
        };

        statsEmitter.emit('requestCompleted', stats);

        expect(writeFileSync).toHaveBeenCalledWith(
            expect.any(String),
            JSON.stringify([stats], null, 2),
        );
    });

    it('creates stats JSON when the log file does not exist yet', () => {
        const writeFileSync = jest.fn();

        jest.doMock('fs', () => ({
            existsSync: jest.fn().mockReturnValue(false),
            readFileSync: jest.fn(),
            writeFileSync,
        }));

        require('../subscribers/loggerSubscriber');
        const statsEmitter = require('../events/statsEmitter');
        const stats = {
            method: 'POST',
            path: '/security',
            status: 201,
        };

        statsEmitter.emit('requestCompleted', stats);

        expect(writeFileSync).toHaveBeenCalledWith(
            expect.any(String),
            JSON.stringify([stats], null, 2),
        );
    });
});
