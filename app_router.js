/**
 * Roteamentos da aplicação
 */
var router    = require('koa-router')()
    , fs      = require('fs-extra')
    , extend  = require('extend')
    , cookies = require('tshark/cookie')
    , reload  = require('require-reload')(require)
;


//region :: Home page

router.get('/', function *(next) {

    // Renderiza index
    this.body = yield this.app.engine.render('index', this);

   // this.body = 'Acesso negado';
});


/**
 * Clientes sem filial
 */
router.get(/^\/(\w+)$/, function *(next) {
    yield initCliente(this);
});

/**
 * Clientes com filial
 */
router.get(/^\/(\w+)\/(\w+)$/, function *(next) {
    yield initCliente(this);
});

/**
 * Inicializa um cliente na primeira carga
 * e seta os cookies necessários para a utilização
 * do aplicativo
 * @param ctx
 */
function *initCliente(ctx){
    var path        = 'apps' + ctx.originalUrl + '/'
        , engine    = ctx.app.engine
        , clientes  = ctx.app.context.clientes
        , app       = ctx.captures[0]
    ;

    // Registra o contexto do cliente
    var novo = engine.assurePath(clientes, ctx.captures, {
        _log: {
            _last_access    : '',
            _logged_users   : { }
        },
        app: ctx.captures,
        flowPaths: {
            up: [
                global.appRoot + '/apps/' + ctx.captures.join('/') + '/',
                global.appRoot + '/apps/' + ctx.captures[0] + '/_common/',
                global.appRoot + '/_common/'
            ],
            down: [
                global.appRoot + '/_common/',
                global.appRoot + '/apps/' + ctx.captures[0] + '/_common/',
                global.appRoot + '/apps/' + ctx.captures.join('/') + '/'
            ]
        }
    });
    
    // Seta o config no request para o cliente atual
    ctx.state.config = engine.getObjPath(clientes, ctx.captures);

    // limpa cache de config
    ctx.state.config.flowPaths.down.forEach((path) => {
        if (fs.existsSync(path + '/config.js')) {
            // delete require.cache[require.resolve(path + '/config.js')];
            extend(true, ctx.state.config, reload(path + '/config.js') || {});
        }
    });
    
    // Verifica o usuário logado
    var user_key = cookies.getLoggedUser(ctx, ctx.captures.join('/'));
    if (!user_key){
        
        // Verifica segurança
        if (ctx.state.config.security.active){
            ctx.body = yield engine.render('login', ctx);
        
        // Seta aleatório    
        } else {
            user_key = cookies.setLoggedUser(ctx, ctx.captures.join('/'));
        }
        
    }

    if (user_key){

        // Registra running
        if (!ctx.app.context.running[user_key]) {
            ctx.app.context.running[user_key] = ctx.state.config;
        }

        // Renderiza index
        ctx.body = yield engine.render('index', ctx);
        
    }
}

//endregion


module.exports = router;
