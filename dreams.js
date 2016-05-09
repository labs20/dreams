/**
 * Engine de aplicações.
 * Implementa gateway de APIS e funções globais.
 * @author labs
 * @since 01/01/2016
 * @param app { koa }
 * @constructor
 */
function Dreams(app){
    this.router = router;
    this.app    = app;

    // Parametros de conexão
    var config  = require('./config.js')
        , MySql = require('./mysql.js')
    ;
    this.db = false;
    try {

        // Instancia o driver
        var db = false;
        switch (config.conexao.tipo) {
            case 'mysql':
                this.db = new MySql(config.conexao);
                break;

            //case 'neo4j': db = Neo4J;   break;

            default:
                console.log('Driver de dados não suportado: ' + connParams.tipo);
        }

    } catch (e){
        log.erro(e);
    }
}



// Mapa de APIs dinâmicas
var apiMap = {
    'users'     : {mod: 'users/users', provider: 'default'},
    'profile'   : {mod: 'users/users', provider: 'profile'},
    'dreamers'  : {mod: 'users/users', provider: 'dreamers'},
    'follower'  : {mod: 'users/users', provider: 'follower'},
    'following' : {mod: 'users/users', provider: 'following'}
};


//region :: Includes

const router    = require('koa-router')()
    , koaBody   = require('koa-body')()
    , extend    = require('extend')
    , fs        = require('fs-extra')
    , util      = require('util')
    , jade      = require('jade')
    , reload    = require('require-reload')(require)
    , log       = require('./_log.js')

    //, Neo4J     = require('./neo4j')
    //, BizObject = require('tshark/biz_object.js')
    //, cookies   = require('tshark/cookie.js')
;

// endregion


//region :: Render de templates

/**
 * Renderiza um arquivo de template
 * @param templId
 * @param ctx
 * @param base
 * @returns {string}
 */
Dreams.prototype.render = function *(templId, ctx, base){
    var check   = templId.split('.')
        , html  = ''
    ;

    if (!check || check.length != 2 || check[1] != 'jade'){
        templId += '.jade';
    }

    // Rastreia o template
    var templ,
        arq = 'views/' + templId;
    if (!templ && fs.existsSync(arq)) {
        templ = arq;
    }

    if(!templ){
        arq = 'modules/' + templId;
        if (!templ && fs.existsSync(arq)) {
            templ = arq;
        }
    }

    if (templ){
        try {
            html = jade.renderFile(templ, ctx || {});
        } catch (e){
            console.error(e);
        }
    }

    // Retorna
    return html;
};

/**
 * Renderiza um string de template
 * @param template
 * @param params
 * @returns {*}
 */
Dreams.prototype.renderStr = function(template, params) {
    return new Promise((resolve, reject) => {
        resolve(jade.renderFile(templ, params));
    });
};

/**
 * Recebe um template e processa o conteúdo extraindo 'row.[field]'
 * dele e retornando em um array
 * @param templ { string } Template a ser pesquisado
 * @param re { regex } Regular expression de tag (opcional, default para /row\.(\w+)/g
 * @returns {Array}
 */
Dreams.prototype.parseFields = function(templ, re){
    if (!templ) return [];

    var tmp = templ.match(re || /row\.(\w+)/g)
        , fields = []
        ;

    if (tmp != null){
        fields = tmp.map(function(f){
            return f.split('.')[1];
        });
    }

    return fields;
};


//endregion



/**
 * Inicializa um Objeto de negócio
 * @param path
 * @param context
 * @return { {} }
 */
Dreams.prototype.initObj = function(path, context){
    var tmp = apiMap[path].mod.split('/')
        , pack = tmp[0]
        , bobj = tmp[1]
    ;

    // Business Object    
    var op = './modules/'
        + pack + '/'
        + bobj + '/'
        + bobj + '.js';
    var obj = this.no_caching_require  
        ? reload(op)
        : require(op)
    ;

    // Cria
    var mod = new obj(path);

    // Vinculo ao engine
    mod.engine = this;

    // Path
    mod.path = {
        pack    : pack,
        obj     : bobj,
        asArray : tmp,
        asString: pack + '/' + bobj
    };

    // Params
    mod.context = this.app.context;
    mod.state   = context.state;
    mod.params  = extend(true, context.request.query || {}, context.request.body || {});
    
    // Retorna
    return mod;
};

/**
 * Retorna um provider
 * @returns { {} }
 */
Dreams.prototype.getProvider = function (provId, mod){

    // Pega o provider
    var provider = mod.providers[provId];
    if (!provider) {
        log.erro('Provider ' + provId + 'não encontrado');
    }

    provider.id = provId;
    for (var s in provider.sources) {
        var src = provider.sources[s]
            , s_pck = mod.path.pack
            , s_tbl
        ;

        switch (src.from.length) {
            case 1:
                s_tbl = src.from[0];
                break;

            case 2:
                s_pck = src.from[0];
                s_tbl = src.from[1];
                break;

            default:
                log.erro('Source em formato invalido no provider');
        }

        // Recupera
        try {
            var obj = require('./modules/'
                + s_pck + '/'
                + s_tbl + '/'
                + s_tbl + '.js'
            );
            var m = new obj();
            provider.sources[s]['src'] = m.source;
        } catch (e) {
            log.erro(e,
                'getProvider: ' + mod.path.asString + ' - ' + provId + '\n' +
                'modules/'
                + s_pck + '/'
                + s_tbl + '/'
                + s_tbl + '.js'
            );
        }
    }

    return provider;
};

/**
 * Implementa uma operação de recuperação de dados
 * @param mod
 * @param ctx
 * @param provider
 * @param params
 * @returns {*}
 */
Dreams.prototype.select = function *(mod, ctx, provider, params){

    // Pega o provider
    var prov = (typeof provider == 'string'
            ? yield this.getProvider(provider, mod)
            : provider
    );

    // Customiza
    extend(true, prov, params || {});

    // Executa
    return yield this.db.select(prov, mod);

};

/**
 * Implementa API de forms para objetos de negócio
 *    - get  | url: owner/pack/mod/_new                  | Retorna um form para pré inserção
 *    - get  | url: owner/pack/mod/123/edit              | Retorna um form para edição do registro id=123
 */
Dreams.prototype.form = function *(mod, ctx){
    var self = this;

    // Objeto de retorno:
    var ret = {
        status: 200,
        success: true,
        path: this.path.asArray,
        layout: { },
        data: []
    };
    ret.form     = mod.params['form'] || {};
    ret.form.key = mod.params['key'];
    ret.form.field = ret.form['field'] || mod.source.metadata.key;

    // Ajusta o key do form
    mod.params[ret.form.field] = ret.form.key;

    // Pega o provider
    var provId = (mod.params['provider'] && mod.params['provider']['id']
            ? mod.params['provider']['id']
            : 'default'
    );
    var provider = yield this.getProvider(provId, mod);

    // Recupera o form
    ret.layout = this.getForm(provider);

    // Evento onGet
    if (this['onGetForm']){
        yield this.onGetForm(ret, ctx);
    }

    if (!ret.layout) {
        return log.erro("Form não encontrado: " + this.path.asString);
    }

    // Fields em form
    this.params._fields = [];
    ret.layout.linhas.forEach((linha) => {
        for (var f in linha) {
            this.params._fields.push(f);
        }
    });

    // Evento onGet
    if (this['onGetFormData']){
        yield this.onGetFormData(provider, ret, ctx);
    }

    // Recupera dados
    ret.data = yield this.select(ctx, provId);

    // Evento onAfterGet
    if (this['onAfterGetForm']){
        yield this.onAfterGetForm(ret, ctx);
    }

    // Retorna
    return ret;
};


//region :: Roteamentos e entradas de APIs


/**
 * Registra o inicio de um roteamento
 */
router.use(function *timeLog(next) {
    //console.log('Time start: ', Date.now());

    var tmp = this.captures[0].split('/').slice(2);
    this.state.api = {
        url: this.originalUrl,
        path:  tmp,
        params: extend(true, this.request.query || {}, this.request.body || {})
    };

    yield next;
});

/**
 * Entrada de API :: GET
 *   Oferece suporte para apis:
 *    - get  | url: dreams/pack/mod                       | Lista todos os registros do mod
 *    - get  | url: dreams/pack/mod?query='teste um dois' | Filtra os registros do mod por query
 *    - get  | url: dreams/pack/mod/123                   | Retorna o registro id=123
 * @since 21/02/16
 */
router.get(/^\/api\/dreams\/.*$/, function *(next) {

    // Recupera Token
    var token = this.req.headers.token

        // id de identificação
        , key = this.state.api.path[2]

        // Pesquisa
        , query = this.state.api.params['query']

        // Evento
        , event = (key
            ? 'Get'
            : query
                ? 'Search'
                : 'List'
        )

        // Objeto de retorno
        , ret = {
            status  : 200,
            msg     : 'sucess',
            data    : []
        }
    ;

    // Instancia o módulo
    var mod = this.app.engine.initObj(this.state.api.path[1], this);
    if (key){
        mod.params[mod.source.metadata.key] = key;
    }

    if (key == 'new'){
        event = 'insert';
        this.body = yield this.app.engine.form(this);
        
    } else {

        // Evento on[event]
        if (mod['on' + event]) {
            yield mod['on' + event](ret, this);
        }

        // Recupera dados
        ret.data = yield this.app.engine.select(mod, this, apiMap[this.state.api.path[1]].provider);

        // Evento onAfter[event]
        if (mod['onAfter' + event]) {
            yield mod['onAfter' + event](ret, this);
        }
    }

    /**
     * Finaliza
     */
    this.state.api.call = event.toLowerCase();
    this.body = ret;
    yield next;
});



/**
 * Entrada de API :: POST
 *   Oferece suporte para apis:
 *    - insert  | url: owner/pack/mod                    | Insere um novo registro no mod
 *    - exec    | url: owner/pack/mod/getStats           | Executa uma função definida no mod
 * 11/04/16
 */
router.post(/^\/(\w+)\/tshark\/.*/, function *(next) {

    /**
     * Instancia o módulo
     * @type BizObject
     */
    var mod   = this.app.engine.initObj(this.state.api.path, this)
        , len = this.state.api.path.length
    ;

    // Execução de função
    if (len = 4){
        var func = this.state.api.call;
        if (!func){
            func = this.state.api.call = 'insert';
        }

        /**
         * Executa a função no objeto
         */
        try {
            var res = yield mod[func](this);
            if (typeof res != 'object'){
                this.body = {
                    result: res
                };
            } else {
                this.body = res;
            }
        } catch (e){
            console.log(e);
        }
    }

    /**
     * Finaliza
     */
    yield next;

});

/**
 * Entrada de API :: PUT
 *   Oferece suporte para apis:
 *    - update  | url: owner/pack/mod/123                 | Atualiza um registro no mod
 * 25/04/16
 */
router.put(/^\/(\w+)\/tshark\/.*/, function *(next) {

    /**
     * Instancia o módulo
     * @type BizObject
     */
    var mod   = this.app.engine.initObj(this.state.api.path, this)
        , len = this.state.api.path.length
    ;

    // Execução de função
    this.state.api.call = 'update';
    this.body = yield mod.update(this);

    /**
     * Finaliza
     */
    yield next;

});

/**
 * Entrada de API :: DELETE
 *   Oferece suporte para apis:
 *    - delete  | url: owner/pack/mod/123                 | Remove um registro no mod
 * 25/04/16
 */
router.delete(/^\/(\w+)\/tshark\/.*/, function *(next) {

    /**
     * Instancia o módulo
     * @type BizObject
     */
    var mod   = this.app.engine.initObj(this.state.api.path, this)
        , len = this.state.api.path.length
    ;

    // Execução de função
    this.state.api.call = 'delete';
    mod.params['key'] = this.state.api.path[3];
    this.body = yield mod.delete(this);

    /**
     * Finaliza
     */
    yield next;

});


/**
 * Finaliza a chamada
 * @since 31/03/16
 */
router.get(/^\/api\/dreams\/.*$/, function *(next) {
    endRoute(this);
});
router.post(/^\/(\w+)\/tshark\/.*$/, function *(next) {
    endRoute(this);
});
router.put(/^\/(\w+)\/tshark\/.*$/, function *(next) {
    endRoute(this);
});
router.delete(/^\/(\w+)\/tshark\/.*$/, function *(next) {
    endRoute(this);
});

/**
 * Registra o fim de um roteamento
 * @param ctx
 */
function endRoute(ctx){

    // Ajusta o pacote de retorno
    ctx.body = ctx.body || {};
    ctx.body['callback'] = ctx.state.api.call;

    // Fecha
   // console.log('Time finish: ', Date.now());
}



//endregion


//region :: Controle de erros
/*
router.use(function errorLog(err, req, res, next) {
    var r = {
        status: 500,
        error: err.message,
        stack: err.stack
    };
    console.error(r);

   // if (app.get('env') !== 'development') {
   //     r.stack = '';
  //  }

    res.send(r);
});


// catch 404 and forward to error handler
router.use(function (err, req, res, next) {
    var err = new Error('TSHARK Not Found');
    err.status = 404;
    next(err);
});

*/
//endregion


// Exporta
module.exports = Dreams;