/**
 * Engine de aplicações - TShark.
 * Implementa gateway de APIS e funções globais.
 * @author labs
 * @since 01/01/2016
 * @param app { koa }
 * @constructor
 */
function TShark(app, no_cache){
    this.router = router;
    this.pool = {conn:{}, map: {}};
    this.app = app;
    this.no_caching_require = true;

    // Parametros de conexão
    var MySql = require('./mysql.js')
    ;
    this.db = false;
    try {

        // Instancia o driver
        var db = false;
        switch (app.context.config.conexao.tipo) {
            case 'mysql':
                this.db = new MySql(app.context.config.conexao);
                break;

            //case 'neo4j': db = Neo4J;   break;

            default:
                console.log('Driver de dados não suportado: ' + app.context.config.conexao.tipo);
        }

    } catch (e){
        log.erro(e);
    }
}


//region :: Includes

const router    = require('koa-router')()
    , koaBody   = require('koa-body')()
    , extend    = require('extend')
    , fs        = require('fs-extra')
    , util      = require('util')
    , jade      = require('jade')
    , reload    = require('require-reload')(require)
    , BizObject = require('tshark/biz_object.js')
    , cookies   = require('tshark/cookie.js')
    , log       = require('tshark/_log.js')
;

// endregion


//region :: Paths em objetos

/**
 * Garante a existência do path em um objeto
 * @param obj { {} } Objeto onde o path deve existir
 * @param path { [] } Array com path
 * @param final_obj { {} } Opcional - Objeto a ser criado ao fim do path 
 */
TShark.prototype.assurePath = (obj, path, final_obj) => {
    var criou = false;
    path.forEach((p) => {
        if (!obj[p]){
            criou = true; 
            obj[p] = {};
        }
        obj = obj[p];
    });
    if (criou &&final_obj) {
        extend(obj, final_obj);
    }
    return criou;
};


/**
 * Remove um path de um objeto
 * @param obj
 * @param path
 */
TShark.prototype.removePath = (obj, path) => {
    delete (obj[path[0]]);
};


/**
 * Retorna um subobjeto em base percorrendo path
 * @param base
 * @param path
 * @returns {*}
 */
TShark.prototype.getObjPath = (base, path) => {
    var obj = base;
    path.forEach((p) => {
        obj = obj[p];
    });
    return obj;
};

//endregion


//region :: FileSystem

/**
 * Verifica se um diretório existe, senão cria.
 * @param path
 * @return path
 */
TShark.prototype.assureDir = (path) => {
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    return path;
};

//endregion



//region :: Render de templates

/**
 * Renderiza um arquivo de template
 * @param templId
 * @param ctx
 * @param base
 * @returns {string}
 */
TShark.prototype.render = function *(templId, ctx, base){
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
TShark.prototype.renderStr = function(template, params) {
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
TShark.prototype.parseFields = function(templ, re){
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
 * @return { BizObject }
 */
TShark.prototype.initObj = function(path, context){
    var m = path.length > 3 ? path[2] : path[path.length-1]
        , pack
        , bobj
    ;
    if (this.app.context.config.apiMap[m]) {
        var tmp = this.app.context.config.apiMap[m].mod.split('/');
        pack = tmp[0];
        bobj = tmp[1];
    } else {
        pack = path[0];
        bobj = path[1];
    }

    // Business Object
    var op = 'business_objects/'
        + pack + '/'
        + bobj + '/'
        + bobj + '.js';
    var obj = this.no_caching_require
            ? reload(op)
            : require(op)
        ;

    // Extende
    if (!obj['extended']) {
        util.inherits(obj, BizObject);
    }

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

    // Token dreamer
    mod.params['_token'] = context.req.headers['x-api-auth-dreamer'];

    // Retorna
    return mod;
};


//region :: Roteamentos e entradas de APIs

/**
 * Registra o inicio de um roteamento
 */
router.use(function *timeLog(next) {
    //console.log('Time start: ', Date.now());

    var tmp = this.captures[0].split('/').splice(1);
    this.state.api = {
        url: this.originalUrl,
        call: tmp[tmp.length-1],
        path:  tmp,
        params: extend(true, this.request.query || {}, this.request.body || {})
    };

    yield next;
});

/**
 * Validação de chamadas de API
 */
router.use(function *(next) {
    var ok = false;

    // Se pedir com educação
    if (this.state.api.path[0] == 'sys'      &&
        this.state.api.path[1] == 'app'      &&
        this.state.api.path[2] == 'security' &&
        this.state.api.path[3] == 'login') {

        var tmp = this.req.headers.referer.split('/').slice(-2);
        this.state.config = this.app.context.clientes[tmp[0]][tmp[1]];

        ok = true;
    }

    // Token
    if (this.req.headers['x-api-auth-token']){

        // Token de acesso
        ok = (this.req.headers['x-api-auth-token'] == this.app.context.config.security.token);
    }

    // Senão...
    if (!ok) {
        var user_key = cookies.getLoggedUser(this);

        // You shall not pass!
        if (!user_key || !this.app.context.running[user_key]) {
            this.throw(404, 'Not Found');

        // Multipass!!
        } else {
            this.state.user_key = user_key;
            this.state.config = this.app.context.running[user_key];
            ok = true
        }
    }

    if (ok){
        yield next;
    } else {
        this.throw(404, 'Not Found');
    }
});


/**
 * Entrada de API :: GET
 *   Oferece suporte para apis:
 *    - get  | url: owner/pack/mod                       | Lista todos os registros do mod
 *    - get  | url: owner/pack/mod?query='teste um dois' | Filtra os registros do mod por query
 *    - get  | url: owner/pack/mod/123                   | Retorna o registro id=123
 *    - get  | url: owner/pack/mod/new                   | Retorna um form para pré inserção
 *    - get  | url: owner/pack/mod/123/edit              | Retorna um form para edição do registro id=123
 * @since 21/02/16
 */
router.get(/^\/api\/dreams\/.*$/, function *(next) {

    /**
     * Instancia o módulo
     * @type BizObject
     */
    var mod   = this.app.engine.initObj(this.state.api.path, this)
        , len = this.state.api.path.length
    ;

    // Form de edição
    if (len == 5 && this.state.api.path[4] == 'edit') {
        this.state.api.call = 'edit';
        mod.params['key'] = this.state.api.path[3];
        this.body = yield mod.form(this);

    } else {

        // Form de inserção
        if (len == 4 && this.state.api.path[3] == 'new') {
            this.state.api.call = 'create';
            mod.params['key'] = 'NEW_KEY';
            this.body = yield mod.form(this);

        // Listagem
        } else {
            this.state.api.call = (this.request.query['query']
                ? 'search'
                : len == 4 && this.state.api.path[3]
                    ? 'get'
                    : 'list'
            );
            if (len == 4){
                mod.params['key'] = this.state.api.path[3];
            }
            if (!mod.params['provider']){
                mod.params['provider'] = {}
            }

            if (!mod.params['provider']['id']){
                mod.params['provider']['id'] = this.app.context.config.apiMap[this.state.api.path[2]].provider;
            }

            /*
            mod.params['provider'] = {
                id: mod.params['provider'] ? mod.params['provider'] : this.app.context.config.apiMap[this.state.api.path[2]].provider
            };*/

            this.body = yield mod.get(this);
        }
    }

    /**
     * Finaliza
     */
    yield next;
});

/**
 * Entrada de API :: POST
 *   Oferece suporte para apis:
 *    - insert  | url: owner/pack/mod                    | Insere um novo registro no mod
 *    - exec    | url: owner/pack/mod/getStats           | Executa uma função definida no mod
 * 11/04/16
 */
router.post(/^\/api\/dreams\/.*/, function *(next) {

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
router.put(/^\/api\/dreams\/.*/, function *(next) {

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
router.delete(/^\/api\/dreams\/.*/, function *(next) {

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
router.post(/^\/api\/dreams\/.*$/, function *(next) {
    endRoute(this);
});
router.put(/^\/api\/dreams\/.*$/, function *(next) {
    endRoute(this);
});
router.delete(/^\/api\/dreams\/.*$/, function *(next) {
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
    ctx.body['path'] = ctx.state.api.path.splice(1,2);

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
module.exports = TShark;