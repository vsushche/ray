const express = require('express');
const morgan = require('morgan');
const render = require('./card-raytracer');


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
    if (typeof startX !== 'number' ||
        typeof startY !== 'number' ||
        typeof endX !== 'number' ||
        typeof endY !== 'number') throw new Error(`No enough parameters`);
    res.send(render(startX, startY, endX, endY))
});


const port = 8080;
app.listen(8080, () => {
    console.log('Listening on port %s', port);
});
