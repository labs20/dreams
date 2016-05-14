/**
 * Servidor de Aplica��es - TShark v3
 *  Servidor de aplica��es distintas, baseadas no engine TShark v3.
 * @link <a href='http://koajs.com/'>Koa</a>
 * @link <a href='https://github.com/alexmingoia/koa-router'>koa-router</a>
 * @link <a href='https://github.com/chrisyip/koa-jade'>koa-jade</a>
 * @link <a href='https://github.com/LeanKit-Labs/seriate'>Seriate</a>
 * @link <a href='http://underscorejs.org/'>Undescore</a>
 * @link <a href='https://www.npmjs.com/package/extend'>extend</a>
 * @author Labs
 * @since 22/03/2016
 */
require('app-module-path').addPath(require('path').resolve(__dirname));
var server      = require('koa-static-server')
    , ts_static = require('./tshark/static')
    , koaBody   = require('koa-body')
    , app       = require('koa')()
;

var path = require('path');
global.appRoot = path.resolve(__dirname);

// Parsing de nested querystring
require('koa-qs')(app);

/**
 * Parsing de body (POST DATA && QUERY STRING)
 */
app.use(koaBody({formidable:{uploadDir: __dirname}}));

/**
 * Configura��es gerais da aplica��o
 * @type { * }
 */
app.context.config = require('./config');

/**
 * Inicializa engine :: TShark
 * @type {TShark}
 */
app.engine = new (require('./tshark/tshark'))(app, true);

/**
 * Roteamento de APIs de business objects
 */
app.use(app.engine.router.routes());


/**
 * Roteamento da aplica��o
 * @type {SQL|exports|module.exports}
 */
var router = require('./app_router');
app.use(router.routes());


/**
 * Roteamento especial de arquivos estaticos
 * (js, css, png, jpg, etc...)
 */
app.use(ts_static({
    caching: false,         // Caching de arquivos       | True quando em produ��o 
    inside_node: false,     // TShark como node_module ? | True quando em produ��o
    quiet: true,            // N�o exibe msg de erros    | True quando em produ��o
    log: false              // False quando em produ��o
}));
//app.use(server({rootDir: 'web'}))


/**
 * Http server
 */
app.listen(app.context.config.run.port);
console.log('running...');