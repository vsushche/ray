const render = require('./card-raytracer');


module.exports = {
    name: 'renderer',
    actions: {
        render: {
            cache: true,
            async handler(ctx) {
                this.logger.info('render', ctx.params);
                ctx.meta.$responseType = 'image/jpeg';
                return render(
                    parseInt(ctx.params.startX),
                    parseInt(ctx.params.startY),
                    parseInt(ctx.params.endX),
                    parseInt(ctx.params.endY)
                );
            }
        }
    }
};