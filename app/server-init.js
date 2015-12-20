import koa from 'koa';
import debug from 'debug';
import * as config from 'config/middlewares/index';
import apis from './server/apis/base';
import controllers from './server/controllers/base';

const app = koa();

// setup middlewares
config.initialLayer(app);
config.errorLayer(app);
config.apiLayer(app, apis);
config.securityLayer(app);
config.renderLayer(app, controllers);

// error logs
app.on('error', function (error) {
  debug('error')(error);
});

export default app;
