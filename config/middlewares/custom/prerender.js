if (process.env.SERVER_RENDERING) {
  const nunjucks = require('nunjucks');
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const { match, RouterContext } = require('react-router');
  const { fetchData } = require('app/client/helpers/fetch-data');
  const getRoutes = require('app/routes').default;
  const App = require('app/client/components/main/app').default;
  const settings = require('config/initializers/settings').default;
  const configureStore = require('app/client/stores/index').default;

  module.exports = function* (next) {
    this.prerender = this.prerender ||
      function (template: string, initialState: Object = {}, parameters: Object = {}) {
        const store = configureStore(initialState);
        const routes = getRoutes(store);

        return new Promise((resolve) => {
          match({ routes, location: this.req.url }, (error, redirectLocation, renderProps) => {
            if (error) {
              this.throw(500, error.message);
            } else if (redirectLocation) {
              this.redirect(redirectLocation.pathname + redirectLocation.search);
            } else if (renderProps) {
              fetchData(renderProps, store)
                .then(() => {
                  const prerenderData = store.getState();
                  const currentRoutes = <RouterContext { ...renderProps } />;
                  const prerenderComponent = renderToString(
                    <App store={ store } routes={ currentRoutes } />
                  );

                  resolve(
                    nunjucks.render(template, {
                      ...settings,
                      ...parameters,
                      prerenderComponent,
                      prerenderData,
                      csrf: this.csrf,
                    })
                  );
                });
            } else {
              this.throw(404);
            }
          });
        });
      };
    yield next;
  };
} else {
  module.exports = function* (next) {
    this.prerender = this.render;
    yield next;
  };
}
