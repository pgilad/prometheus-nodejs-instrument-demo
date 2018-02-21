const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const Prometheus = require('prom-client');

const app = express();
const logger = morgan('tiny');

const counter = new Prometheus.Counter({
    name: 'total_requests',
    help: 'Total requests to submit',
    labelNames: ['target']
});

const sizes = new Prometheus.Gauge({
    name: 'request_size',
    help: 'Request Size',
    labelNames: ['target']
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.use(logger);

app.all('/submit', bodyParser.json({ limit: '50mb' }), (req, res) => {
    const target = req.query.target;
    if (!target) {
        return res.status(400).json({ error: 'Missing target' });
    }
    const size = JSON.stringify(req.body).length;
    sizes.set({ target }, size);
    counter.inc({ target });
    const delay = getRandomInt(50, 300);
    // simulate a random response time
    setTimeout(() => {
        res.sendStatus(200);
    }, delay);
});

app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
});

app.get('*', (req, res) => {
    res.sendStatus(404);
});

app.listen(8000, () => {
    console.log('express listening on 8000');
});
