const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

require('./subscribers/loggerSubscriber');

const securityRouter = require('./routes/security');

const timingAndRateLimit = require('./middlewares/timingRateLimit');
const statsLogger = require('./middlewares/statsLogger');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(timingAndRateLimit);
app.use(statsLogger);

const swaggerOptions = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            title: 'Investment API',
            version: '1.0.0',
            description: 'API для керування інвестиційними фондами (Лабораторна робота)',
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: [path.join(__dirname, './controllers/*.js')],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

app.use('/security', securityRouter);

app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'Маршрут не знайдено. Скористайтеся документацією: http://localhost:3000/api-docs',
    });
});

module.exports = app;
