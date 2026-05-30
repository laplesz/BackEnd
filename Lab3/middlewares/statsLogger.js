const statsEmitter = require('../events/statsEmitter');

const maskData = obj => {
    const sensitive = ['password', 'token', 'email'];
    const masked = { ...obj };
    Object.keys(masked).forEach(key => {
        if (sensitive.some(s => key.toLowerCase().includes(s))) masked[key] = '***';
    });
    return masked;
};

const statsLogger = (req, res, next) => {
    res.on('finish', () => {
        const stats = {
            time: new Date().toISOString(),
            method: req.method,
            path: req.path,
            userAgent: req.get('User-Agent'),
            params: maskData(req.params),
            query: maskData(req.query),
            status: res.statusCode,
        };

        statsEmitter.emit('requestCompleted', stats);
    });
    next();
};

module.exports = statsLogger;
