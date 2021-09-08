const jpeg = require('jpeg-js');

const width = 512;
const height = 512
const numRow = 8;
const numCol = 8;
const rowHeight = height / numRow;
const colWidth = width / numCol;

module.exports = {
    name: 'renderer2',
    actions: {
        render: {
            cache: false,
            async handler(ctx) {
                this.logger.trace('render2', ctx.params);
                ctx.meta.$responseType = 'image/jpeg';
                const promises = [];
                for(let row = 0; row < numRow; row++) {
                    for(let col = 0; col < numCol; col++) {
                        promises.push(this.broker.call('renderer.render', {
                            startX: `${col * colWidth}`,
                            startY: `${row * rowHeight}`,
                            endX: `${(col + 1) * colWidth}`,
                            endY: `${(row + 1) * rowHeight}`
                        })
                        .then(jpegData => {
                            if(jpegData.type === 'Buffer') {
                                jpegData = Buffer.from(jpegData.data);
                            }
                            return jpeg.decode(jpegData).data
                        }));
                    }
                }
                const data = Buffer.alloc(width * height * 4);
                const chunks = await Promise.all(promises);
                for(let row = 0; row < numRow; row++) {
                    for(let col = 0; col < numCol; col++) {
                        const piece = chunks[(numRow - row - 1) * numCol + (numCol - col - 1)];
                        for(let line = 0; line < rowHeight; line++) {
                            const targetStart = (row * rowHeight + line) * width * 4 + col * colWidth * 4;
                            const sourceStart = line * colWidth * 4;
                            const sourceEnd = sourceStart + colWidth * 4
                            piece.copy(data, targetStart, sourceStart, sourceEnd);
                        }
                    }
                }
                return jpeg.encode({ data, width, height }, 50).data
            }
        }
    }
};