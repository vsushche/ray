const express = require('express');
const morgan = require('morgan');
const render = require('./card-raytracer');

function lastValue(i, cb) {
    const { value, done } = i.next();
    if(done) return process.nextTick(cb.bind(null, value));
    setImmediate(lastValue, i, cb);
}

function lastValue2(i, cb) {
    for(;;) {
        const { value, done } = i.next();
        if(done) return process.nextTick(cb.bind(null, value));
    }
}


const app = express();
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.static('static'));

app.get('/render', (req, res) => {
    res.setHeader('Content-Type', 'image/jpeg');
    let { startX, startY, endX, endY } = req.query;
    startX = parseInt(startX);
    startY = parseInt(startY);
    endX = parseInt(endX);
    endY = parseInt(endY);
    console.log({ startX, startY, endX, endY });
    if(typeof startX !== 'number' ||
        typeof startY !== 'number' ||
        typeof endX !== 'number' ||
        typeof endY !== 'number') throw new Error(`No enough parameters`);
        lastValue(render(startX, startY, endX, endY), r => res.send(r));
});


const port = 8080;
app.listen(8080, () => {
    console.log('Listening on port %s', port);
});
