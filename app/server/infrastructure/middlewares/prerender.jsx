/* @flow */
/* global process */
import React from "react";
import Helmet from "react-helmet";
import { renderToString } from "react-dom/server";
import App from "../../../client/components/app";

let getRouter = require("../../helpers/getRouter").default;

if (process.env.NODE_ENV === "development" && module.hot) {
  // $FlowFixMe
  module.hot.accept("../../helpers/getRouter", () => {
    getRouter = require("../../helpers/getRouter").default;
  });
}

export default async (ctx: Object, next: Function) => {
  if (process.env.SERVER_RENDERING) {
    ctx.prerender = async (template: string, parameters: Object = {}) => {
      const { Api, redirect, status, element } = await getRouter(ctx.req.url);

      if (redirect) {
        ctx.redirect(redirect.url);
      } else if ([404, 500].includes(status)) {
        ctx.throw(status);
      } else {
        const prerenderComponent = renderToString(<App router={element} />);
        const prerenderData = Api.fetcher.toJSON();

        // prevent memory leak
        Helmet.rewind();

        ctx
          .render(template, {
            ...parameters,
            prerenderComponent,
            prerenderData
          });
      }
    };
    await next();
  } else {
    ctx.prerender = ctx.render;
    await next();
  }
};
