import Template7 from 'template7';
import { extend } from '../../shared/utils';

export default {
  name: 'routerTemplateLoader',
  proto: {
    templateLoader({ template, templateUrl, options, resolve, reject } = {}) {
      const router = this;
      function compile(t) {
        let compiledHtml;
        let context;
        try {
          context = options.context || {};
          if (typeof context === 'function') context = context.call(router);
          else if (typeof context === 'string') {
            try {
              context = JSON.parse(context);
            } catch (err) {
              reject();
              throw err;
            }
          }
          if (typeof t === 'function') {
            compiledHtml = t(context);
          } else {
            compiledHtml = Template7.compile(t)(
              extend({}, context || {}, {
                $app: router.app,
                $root: extend({}, router.app.data, router.app.methods),
                $route: options.route,
                $f7route: options.route,
                $router: router,
                $f7router: router,
                $theme: {
                  ios: router.app.theme === 'ios',
                  md: router.app.theme === 'md',
                  aurora: router.app.theme === 'aurora',
                },
              }),
            );
          }
        } catch (err) {
          reject();
          throw err;
        }
        resolve(compiledHtml, { context });
      }
      if (templateUrl) {
        // Load via XHR
        if (router.xhrAbortController) {
          router.xhrAbortController.abort();
          router.xhrAbortController = false;
        }
        router
          .xhrRequest(templateUrl, options)
          .then((templateContent) => {
            compile(templateContent);
          })
          .catch(() => {
            reject();
          });
      } else {
        compile(template);
      }
    },

    modalTemplateLoader({ template, templateUrl, options, resolve, reject } = {}) {
      const router = this;
      return router.templateLoader({
        template,
        templateUrl,
        options,
        resolve,
        reject,
      });
    },

    tabTemplateLoader({ template, templateUrl, options, resolve, reject } = {}) {
      const router = this;
      return router.templateLoader({
        template,
        templateUrl,
        options,
        resolve,
        reject,
      });
    },

    pageTemplateLoader({ template, templateUrl, options, resolve, reject } = {}) {
      const router = this;
      return router.templateLoader({
        template,
        templateUrl,
        options,
        resolve: (html, newOptions = {}) => {
          resolve(router.getPageEl(html), newOptions);
        },
        reject,
      });
    },
  },
};
