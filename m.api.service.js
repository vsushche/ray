const ApiService = require("moleculer-web");

module.exports = {
    mixins: [ApiService],
    name: 'api',
    settings: {
        port: 8080,
        assets: {
            folder: './static',
        },
        routes: [{
            mappingPolicy: "restrict",
            aliases: {
                'GET /render': 'renderer.render',
                'GET /render2': 'renderer2.render'
            }
        }]
    }
};

