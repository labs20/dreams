/**
 * Wrapper para Objetos de Negócio.
 * Implementa entradas de APIS e funções globais para
 * objetos de negócio.
 * @author labs
 * @since 23/02/16.
 * @constructor
 */
function BizObject(){

}


//region :: Includes

const _         = require('underscore')
    , extend    = require('extend')
    , log       = require('./_log');

//endregion


// region :: Métodos internos

/**
 * Retorna um objeto de resposta padrão
 * @param api
 * @returns {{status: number, success: boolean, layout: {}, data: Array}}
 */
BizObject.prototype.getReturnObj = function (){
    return {
        status: 200,
        success: true,
        path: this.path.asArray,
        layout: { },
        data: []
    };
};

/**
 * Retorna um form
 * @param provider
 * @returns {*}
 */
BizObject.prototype.getForm = function (provider){
    var formId = (
        this.params['form'] && this.params['form']['id']
            ? this.params['form']['id']
            : 'update'
    );
    var form = this.forms[formId];
    if (!form) { return false; }


    //region :: Ajusta config

    form['_config']        = form['_config']        || {};
    form._config['bounds'] = form._config['bounds'] || { width: 800, height: 450 };
    form._config['labels'] = form._config['labels'] || types.form.lines.labels.ontop;
    form._config['comps']  = form._config['comps']  || types.form.lines.distribution.percent;
    form._config['state']  = form._config['state']  || types.form.state.loading;
    form._config['size']   = form._config['size']   || types.form.size.small;

    //endregion


    // region :: Ajusta Ctrls

    var meta = {};
    extend(true, meta, this.source.metadata, meta);
    
    var self = this;
    form['ctrls'] = form['ctrls'] || {};
    form.linhas.forEach(function(linha){
        for(var ctrl in linha){

            // Pega o comp no meta e ajusta tipo
            var comp = (meta.fields[ctrl]
                ? extend(meta.fields[ctrl], meta.fields[ctrl]['tipo'])
                : {}
            );

            // Se o comp tá sobreescrito em ctrls
            if (form.ctrls[ctrl]){
                extend(true, comp, form.ctrls[ctrl]);
                if(form.ctrls[ctrl]['tipo']) {
                    extend(true, comp, form.ctrls[ctrl]['tipo'] || {});
                }
            }

            // Comp com dataset
            /*if (comp['data']){
                var mod = self.getObjViaFrom(req, comp['data']['from']);

                // Recupera provider
                var prov = mod.getProvider({
                    query: {
                        provider: {id: comp['data']['provider']}
                    }
                });

                // Recupera dados
                if (prov) {
                    var ds = mod.getDataSource(req);
                    var r = ds.load(prov, req);
                    comp.data['rows'] = r;
                }
            }*/

            // Entrega
            delete(comp['tipo']);
            form.ctrls[ctrl] = comp;
        }

    });

    // endregion

    return form;
};

// endregion


//region :: APIs

/**
 * Implementa API GET em módulos
 *    - get  | url: owner/pack/mod                       | Lista todos os registros do mod
 *    - get  | url: owner/pack/mod?query='teste um dois' | Filtra os registros do mod por query
 *    - get  | url: owner/pack/mod/123                   | Retorna o registro id=123
 */
BizObject.prototype.get = function *(ctx){
    var self = this;

    // Objeto de retorno:
    var ret = this.getReturnObj();

    // Template:
    ret.template = this.params['template'] || 'list';

    // Evento onGet
    if (this['onGet']){
        yield this.onGet(ret, ctx);
    }
    
    // Evento on[func]
    var func = ctx.state.api.call;
    if (func != 'get') {
        func = func.charAt(0).toUpperCase() + func.slice(1);
        if (this['on' + func]) {
            yield this['on' + func](ret, ctx);
        }
    } else {
        if (this['source'] && this.source['metadata'] && this.source.metadata['key']) {
            this.params[this.source.metadata.key] = ctx.state.api.path[3];
        }
    }
    
    // Template
    var templ = yield this.engine.render(this.path.asString + '/' + ret.template, ctx, 'modulos');
    if (!this.params['_no_template_']) {
        ret.layout[ret.template] = templ;
    }

    // Fields em template
    this.params._fields = this.engine.parseFields(templ);
        
    // Recupera provider
    var provId = (this.params['provider'] && this.params['provider']['id']
        ? this.params['provider']['id']
        : 'default'
    );

    // Recupera dados
    ret.data = yield this.select(ctx, provId);

    // Evento onAfterGet
    if (this['onAfterGet']){
        yield this.onAfterGet(ret, ctx);
    }

    // Evento onAfter[func]
    if (this['onAfter' + func]){
        yield this['onAfter' + func](ret, ctx);
    }
    
    // Retorna
    return ret;
    
};

/**
 * Implementa API de forms para objetos de negócio
 *    - get  | url: owner/pack/mod/_new                  | Retorna um form para pré inserção
 *    - get  | url: owner/pack/mod/123/edit              | Retorna um form para edição do registro id=123
 */
BizObject.prototype.form = function *(ctx){
    var self = this;

    // Objeto de retorno:
    var ret      = this.getReturnObj('form');
    ret.form     = this.params['form'] || {};
    ret.form.key = this.params['key'];
    ret.form.field = ret.form['field'] || this.source.metadata.key;

    // Ajusta o key do form
    this.params[ret.form.field] = ret.form.key;

    // Pega o provider
    var provId = (this.params['provider'] && this.params['provider']['id']
        ? this.params['provider']['id']
        : 'default'
    );
    var provider = yield this.getProvider(provId);

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

/**
 * Implementa API PUT em módulos
 *    - update  | url: owner/pack/mod/123                | Atualiza um registro no mod
 */
BizObject.prototype.update = function *(ctx){
    return yield this.change('update', ctx);
};

/**
 * Implementa API POST em módulos
 *    - insert  | url: owner/pack/mod                    | Insere um novo registro no mod
 */
BizObject.prototype.insert = function *(ctx){
    return yield this.change('insert', ctx);
};

/**
 * Implementa API DELETE em módulos
 *    - delete  | url: owner/pack/mod/123                 | Remove um registro no mod
 */
BizObject.prototype.delete = function *(ctx){

    // Ajusta row
    this.params.row = this.params['row'] || {};
    this.params.row[this.source.metadata.key] = this.params.row[this.source.metadata.key] || this.params.key;

    // Executa
    return yield this.change('delete', ctx);
};

//endregion


//region :: Dados

/**
 * Retorna um provider
 * @returns { {Promise} }
 */
BizObject.prototype.getProvider = function (provId, from, ctx){

    // Ajusta o dono
    var mod = this;

    if (typeof provId == 'string') {
        if (from) {
            mod = this.engine.initObj(from, ctx); /* new (require('business_objects/'
                + from[0] + '/'
                + from[1] + '/'
                + from[1] + '.js'
            ))();*/
        }

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
                var obj = require('business_objects/'
                    + s_pck + '/'
                    + s_tbl + '/'
                    + s_tbl + '.js'
                );
                var m = new obj();
                provider.sources[s]['src'] = m.source;
            } catch (e) {
                log.erro(e,
                    'getProvider: ' + mod.path.asString + ' - ' + provId + '\n' +
                    'business_objects/'
                    + s_pck + '/'
                    + s_tbl + '/'
                    + s_tbl + '.js'
                );
            }
        }
    } else {
        provider = provId;
    }

    return provider;
};

/**
 * Implementa uma operação de recuperação de dados
 * @param ctx
 * @param provider
 * @param params
 * @param from
 * @returns {*}
 */
BizObject.prototype.select = function *(ctx, provider, params, from){

    // Pega o provider
    var prov = (typeof provider == 'string'
            ? yield this.getProvider(provider, from, ctx)
            : provider
    );

    // Customiza
    extend(true, prov, params || {});

    // Executa
    return yield this.engine.db.select(prov, this);
};

/**
 * Implementa uma operação de alteração de dados
 * @param op
 * @param ctx
 * @returns {{result: boolean}}
 */
BizObject.prototype.change = function *(op, ctx){
    var dts = this.engine.db;
    if (dts) {

        // Recupera provider
        var provId = (this.params['provider'] && this.params['provider']['id']
                ? this.params['provider']['id']
                : 'update'
        );

        // Pega o provider
        var prov = yield this.getProvider(provId)
            , res = {
                result: false
            },
            evento = op.charAt(0).toUpperCase() + op.slice(1)
        ;

        if (this['on' + evento]){
            yield this['on' + evento](prov, ctx);
        }

        // Executa
        switch (op){
            case 'insert' : res.result = yield dts.insert(prov, this); break;
            case 'update' : res.result = yield dts.update(prov, this); break;
            case 'delete' : res.result = yield dts.delete(prov, this); break;
        }

        if (this['onAfter' + evento]){
            yield this['onAfter' + evento](res, ctx);
        }


        // Retorna
        return res;
    }
};


//endregion


//region :: Utils

BizObject.prototype.readDir = function(path, res){
    var fs          = require('fs-extra')
        , dir       = fs.readdirSync(path)
        , result    = res || []
        , fpath     = require('path')
    ;

    dir.forEach((d) => {
        if (d[0] != '.') {
            var p = {id: d, ext: '', sub: []}
                , new_path = path + '/' + d
                , is_dir = false
                , stat = fpath.parse(new_path)
                ;

            try {
                is_dir = fs.statSync(new_path).isDirectory();
            }
            catch (e) {
                is_dir = false;
            }

            if (is_dir) {
                this.readDir(new_path, p.sub);
            }
            p.ext = stat.ext;
            result.push(p);
        }
    });
    
    return result;
};


//endregion


// Exporta
module.exports = BizObject;