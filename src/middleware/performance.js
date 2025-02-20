// Performance Middleware (src/middleware/performance.js)
const compression = require('compression');
const helmet = require('helmet');

module.exports = {
    setupPerformance(app) {
        // Enable GZIP compression
        app.use(compression());
        
        // Security headers
        app.use(helmet());
        
        // CORS configuration
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
    }
};