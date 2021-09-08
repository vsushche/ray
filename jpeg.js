const fs = require('fs');
const trace = require('./card-raytracer');

const file = process.argv[2] || '1.jpeg';
const startX = parseInt(process.argv[3] || '0');
const startY = parseInt(process.argv[4] || '0');
const endX = parseInt(process.argv[5] || '512');
const endY = parseInt(process.argv[6] || '512');
console.log('Arguments: ', {
    file, startX, startY, endX, endY
});

function lastValue(i) {
    for(;;) {
        const { value, done } = i.next();
        if(done) return value;
    }
}

fs.writeFileSync(file, lastValue(trace(startX, startY, endX, endY)));