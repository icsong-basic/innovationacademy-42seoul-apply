const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy('/api', {
      target: 'https://42seoul-apply-test.azy.kr',
      changeOrigin: true
    })
  );
};