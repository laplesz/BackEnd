/* eslint-disable global-require */

const ORIGINAL_ENV = process.env;

describe('database config', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.doMock('dotenv', () => ({ config: jest.fn() }));
        process.env = {};
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV;
        jest.dontMock('dotenv');
    });

    it('uses defaults when database environment variables are missing', () => {
        const config = require('../config/db.config');

        expect(config.db).toEqual({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'investments3',
            port: 3306,
            connectTimeout: 60000,
        });
        expect(config.listPerPage).toBe(10);
    });

    it('uses configured database environment variables', () => {
        process.env = {
            DB_HOST: 'db.local',
            DB_USER: 'app_user',
            DB_PASSWORD: 'secret',
            DB_NAME: 'investments_test',
            DB_PORT: '3307',
        };

        const config = require('../config/db.config');

        expect(config.db).toEqual({
            host: 'db.local',
            user: 'app_user',
            password: 'secret',
            database: 'investments_test',
            port: 3307,
            connectTimeout: 60000,
        });
    });
});
