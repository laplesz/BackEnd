const rateLimitStore = {};
const LIMIT = 50;
const WINDOW_MS = 60000;

const timingAndRateLimit = (req, res, next) => {
    const { ip } = req;
    const now = Date.now();

    if (!rateLimitStore[ip]) {
        rateLimitStore[ip] = { count: 1, resetTime: now + WINDOW_MS };
    } else if (now > rateLimitStore[ip].resetTime) {
        rateLimitStore[ip] = { count: 1, resetTime: now + WINDOW_MS };
    } else {
        rateLimitStore[ip].count += 1;
        if (rateLimitStore[ip].count > LIMIT) {
            return res.status(429).json({ error: 'Забагато запитів. Спробуйте пізніше.' });
        }
    }

    const start = process.hrtime();
    const originalSend = res.send;

    res.send = function sendWithTiming(body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const diff = process.hrtime(start);
            const timeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
            res.setHeader('X-Response-Time', `${timeMs}ms`);
        }

        return originalSend.call(this, body);
    };

    return next();
};

module.exports = timingAndRateLimit;
