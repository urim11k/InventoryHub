// Cache Middleware (src/middleware/cache.js)
const nodeCache = require('node-cache');
const cache = new nodeCache();

module.exports = {
    middleware(duration) {
        return (req, res, next) => {
            const key = req.originalUrl;
            const cachedResponse = cache.get(key);

            if (cachedResponse) {
                res.json(cachedResponse);
                return;
            }

            res.originalJson = res.json;
            res.json = (body) => {
                cache.set(key, body, duration);
                res.originalJson(body);
            };
            next();
        };
    }
};