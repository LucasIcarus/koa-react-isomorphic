import cors from 'koa-cors';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import staticAssets from 'koa-static';
import htmlMinifier from 'koa-html-minifier';
import router from 'koa-router';
import conditionalGet from 'koa-conditional-get';
import etag from 'koa-etag';
import csrf from 'koa-csrf';
import convert from 'koa-convert';
import session from 'koa-generic-session';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import settings from 'server/initializers/settings';
import render from './custom/render';
import prerender from './custom/prerender.jsx';
import error from './custom/error';

export const loggingLayer = app =>
  app
    .use(convert(logger())); // https://github.com/koajs/logger

export const initialLayer = app =>
  app
    .use(convert(staticAssets(settings.path.PUBLIC, { gzip: true }))) // https://github.com/koajs/static
    .use(bodyParser()); // https://github.com/koajs/bodyparser

export const apiLayer = (app, apiRoutes) => {
  const newRouter = router();

  newRouter
    .use(convert(conditionalGet())) // https://github.com/koajs/conditional-get
    .use(convert(etag())) // https://github.com/koajs/etag
    .use(convert(cors())); // https://github.com/koajs/cors

  apiRoutes(newRouter);

  app
    .use(newRouter.routes())
    .use(newRouter.allowedMethods());

  return newRouter;
};

export const securityLayer = app => {
  app.keys = [process.env.SECRET_KEY];

  csrf(app);
  app
    .use(convert(session())) // https://github.com/koajs/session
    .use(convert(csrf.middleware)) // https://github.com/koajs/csrf
    .use(helmet()); // https://github.com/venables/koa-helmet
};

export const renderLayer = (app, templateRoutes) => {
  const newRouter = router();

  newRouter
    .use(render)
    .use(prerender)
    .use(convert(htmlMinifier({
      collapseWhitespace: true,
      removeComments: true,
      preserveLineBreaks: false,
      removeEmptyAttributes: false,
      removeIgnored: true,
    }))) // https://github.com/kangax/html-minifier
    .use(convert(compress())); // https://github.com/koajs/compress

  templateRoutes(newRouter);

  app
    .use(newRouter.routes())
    .use(newRouter.allowedMethods());

  return newRouter;
};

export const errorLayer = app =>
  app
    .use(error);
