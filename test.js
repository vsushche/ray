const http = require('http');

const host = 'localhost';

const imageWidth = 512;
const imageHeight = 512;
const numRows = parseInt(process.argv[2]);
const numCol = numRows;
const rowHeigh = imageHeight / numRows;
const colWidth = imageWidth / numCol;
console.log({ numCol, numRows });
let pieces = numRows * numCol;
const startTime = Date.now();
for(let row = 0; row < numRows; row++) {
    for(let col = 0; col < numCol; col++) {
        const startX = Math.round(col * colWidth);
        const startY = Math.round(row * rowHeigh);
        const endX = Math.round(startX + colWidth);
        const endY = Math.round(startY + rowHeigh);
        const url = `http://${host}:8080/render?startX=${startX}&startY=${startY}&endX=${endX}&endY=${endY}`;
        console.log(url);
        http.get(url, res => {
            const { statusCode } = res;
            if(statusCode !== 200) {
                console.error('Invalid status code', statusCode);
                return;
            }
            res.on('data', () => {});
            res.on('end', () => {
                console.log(pieces);
                if(--pieces === 0) {
                    console.log('Time: %ss', (Date.now() - startTime) / 1000);
                }
            });
            res.on('error', e => console.error(e));
        });
    }
}
