const trace = require('./card-raytracer');


async function lastValue(i) {
    function f(i, cb) {
        const { value, done } = i.next();
        if(done) return cb(value);
        setImmediate(f, i, cb);
    }
    return new Promise(resolve => f(i, resolve));
}

module.exports = {
    name: 'renderer',
    actions: {
        render: {
            cache: true,
            async handler(ctx) {
                this.logger.trace('render', ctx.params);
                ctx.meta.$responseType = 'image/jpeg';
                return lastValue(trace(
                    parseInt(ctx.params.startX), 
                    parseInt(ctx.params.startY), 
                    parseInt(ctx.params.endX), 
                    parseInt(ctx.params.endY)
                    ));
            }
        }
    }
};