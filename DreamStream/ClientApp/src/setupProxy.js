const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:51990';

module.exports = function (app) {
    const appProxy = createProxyMiddleware('/api', {
        target: target,
        // Handle errors to prevent the proxy middleware from crashing when
        // the ASP NET Core webserver is unavailable
        onError: err => console.error(err.message),
        secure: false,
        // Uncomment this line to add support for proxying websockets
        //ws: true, 
        headers: {
            Connection: 'Keep-Alive'
        }
    });

    app.use(appProxy);
};
