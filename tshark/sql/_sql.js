/**
 * Driver para conexões a datasources baseados em SQL.
 * @author labs
 * @since 10/03/2016
 * @constructor
 */
function SQL(db){
    this.db = db;
}

//region :: Includes

const util      = require('util')
    , _         = require('underscore')
    , moment    = require('moment')
    , log       = require('../_log')
;

//endregion


/**
 * Inicializa o driver
 * @param connParams
 */
SQL.prototype.init = function(connParams){

    // Parametros de conexão
    this.connParams = connParams;

};


// region :: Utils

/**
 * Retorna um pacote no formato padrão
 * @returns {{index: {}, rows: Array, page: number}}
 */
function getDataPack(){
    return {
        index: {},
        rows: [],
        page: 0
    };
}

/**
 * Retorna sqlPArams
 * @type {{
     *      table   : '',
     *      alias   : '',
     *      distinct: '',
     *      fields  : [],
     *      joins   : [],
     *      meta    : {},
     *      key     : {field: '', val: ''},
     *      where   : [],
     *      group   : [],
     *      having  : [],
     *      order   : [],
     *      limit   : {max: 0, page: 0},
     *      showSQL : false
     * }}
 */
function getSqlParams() {
    return {
        table   : '',
        alias   : '',
        distinct: '',
        fields  : [],
        joins   : [],
        meta    : {},
        key     : {field: '', val: ''},
        where   : [],
        group   : [],
        having  : [],
        order   : [],
        limit   : {max: 0, page: 0},
        showSQL : false
    }
}

/**
 * Verifica se o texto é uma data válida
 * @param str {string}
 * @returns {boolean}
 */
function isDate(str){
    if (!str) return false;
    var sep = (str.indexOf('/') > -1
            ? '/'
            : str.indexOf('-') > -1
            ? '-'
            : ''
    );
    if (!sep) return false;

    var tmp = str.split(sep);
    if (tmp.length != 3) return false;

    if (!util.isNumber(tmp[0]) ||
        !util.isNumber(tmp[1]) ||
        !util.isNumber(tmp[2])) return false;

    return true;
}

//endregion


//region :: Parsing


/**
 * Processa um provider e o transforma em sqlParams
 * @param provider
 * @param obj { BizObject }
 */
SQL.prototype._parseProvider = function(provider, obj){

    // Ajusta sqlParams
    var sqlParams = {
        key     : {field: '', val: ''},
        distinct: provider['distinct'] || ' distinct ',
        fields  : provider['fields'] || {},
        meta    : {},
        joins   : [],
        where   : provider['where']  || [],
        search  : provider['search'] || [],
        group   : provider['group']  || [],
        having  : provider['having'] || [],
        order   : provider['order']  || [],
        limit   : {max: provider['limit'] || 0, page: 0},
        showSQL : provider['showSQL'] || false
    };

    var fields = (obj.params['fields'] || []).concat(obj.params['_fields'] || []);

    // Processa provider
    for(var s in provider.sources) {
        var source = provider.sources[s].src
            , alias = 'tb' + s;

        // Tabela principal
        if (!sqlParams['table']) {
            sqlParams.table = source.table;
            sqlParams.key.field = source.metadata.key;
            sqlParams.key.val = obj.params[source.metadata.key];
            sqlParams.alias = alias;
        }

        // Fields
        this.db.parseFields(sqlParams, provider.sources[s], fields, source.metadata.fields, alias);

        // Joins
        if (provider.sources[s]['join']) {
            this.db.parseJoin(sqlParams, provider.sources[s]['join'], source.table, alias, '');
        }
    }

    // Processa order
    var tmp = '';
    sqlParams.order.forEach((order) => {
        tmp += '\n      ' + (typeof order == 'string' 
            ? order 
            : 'tb' + order[0] + '.' + order[1] + ' ' + order[2]
        );
    });
    sqlParams.order = tmp;

    return sqlParams;
};


/**
 * Ajusta fields em sqlParams
 * @param prov
 * @param ctx_fields
 * @param meta_fields
 * @param alias
 */
SQL.prototype._parseFields = function(sqlParams, prov, ctx_fields, meta_fields, alias){

    // Fields forçados
    if (prov['force_fields'] && util.isArray(prov['force_fields'])){
        prov['force_fields'].forEach(function(f){
            if (!sqlParams.fields[f]) {
                sqlParams.fields[f] = alias;
            }
        }, this);

        // Fields mapeados
    } else {
        for (var f in meta_fields){

            // Primeiro a chegar entra
            if (!sqlParams.fields[f]) {
                var ok = false;

                // Acrescenta _key
                if (f.substr(-4) == '_key') {
                    ok = true;
                }

                // Select all em fields
                if (prov['fields'] && (prov['fields'] == '*' || prov['fields'][0] == '*')) {
                    ok = true;
                }

                // Explicitamente requisitado
                if (prov['fields'] && prov['fields'].indexOf(f) > -1) {
                    ok = true;
                    prov['fields'][prov['fields'].indexOf(f)] = null;
                }

                // Em contexto
                if (ctx_fields.indexOf(f) > -1){
                    ok = true;
                }

                if (ok) {
                    sqlParams.fields[f] = alias;
                    sqlParams.meta[f] = meta_fields[f];
                }
            }
        }
    }

    // Fields de função
    if (prov['fields'] && util.isArray(prov['fields'])) {
        prov['fields'].forEach(function (f) {
            if (f && util.isArray(f)) {
                var 
                    fld    = f[0]
                    , tipo = f[1]
                    , fnc  = f[2];
                
                if (!sqlParams.fields['__as__']) {
                    sqlParams.fields['__as__'] = [];
                }
                
                if (tipo == 'as') {
                    sqlParams.fields['__as__'].push(
                        alias + '.' + fld + ' as ' + fnc
                    );
                
                } else if (tipo == 'func'){
                    sqlParams.fields['__as__'].push(
                        '(' + fnc + ') as ' + fld
                    );
                }
            }
            
        }, this);
    }

};


/**
 * Identifica os joins
 * @param join { {source: 0, tipo: 'inner', on: 'map_filiais_key', where: ''} }
 * @param table
 * @param alias
 * @param nolock
 */
SQL.prototype._parseJoin = function(sqlParams, join, table, alias, nolock){

    // Join implicito
    if (join['tipo'] == 'implicit') {
        sqlParams.joins.push(", " + table + " as " + alias + ' ' + nolock);

    // Join 'à mão'
    } else if (join['tipo'] == 'sql'){
        sqlParams.joins.push(join['sql']);

    // Join normal
    } else {
        var template = " %s JOIN %s %s ON (%s %s %s ";
        /*if (join['where']) {
         var wtempl = " %s tb%s.%s %s '%s' ";
         var jwhere = parseWhereItem(join['where'], $params['master']['dataset']);
         foreach ($jwhere as $w){
         //array($tbRef, $key, $cond, '=', $where_key);
         if (is_string($w)) {
         $template .= $w;
         } else {
         if ($w[4] == 'NULL') {
         $wtempl = " %s tb%s.%s %s %s ";
         }
         $template .= sprintf($wtempl, $w[0], $w[1], $w[2], $w[3], $w[4]);
         }
         }
         }*/
        template += ")";

        var
            opt             = (join['opt'] ? join['opt'] : '=')
            , that_alias    = "tb" + join['source']
            , this_key
            , that_key
            ;

        // Chaves idênticas em ambas tabelas
        if (!util.isArray(join['on'])){
            this_key = alias + '.' + join['on'];
            that_key = that_alias + '.' + join['on'];

            // Chaves diferentes nas tabelas:
        } else {
            this_key = alias + '.' + join['on'][0];
            that_key = that_alias + '.' + join['on'][1];
        }

        sqlParams.joins.push(
            util.format(template,
                join['tipo'], table, alias + ' ' + nolock, this_key, opt, that_key
            )
        );
    }
};


/**
 * Processa where
 * @param params { {} }
 */
SQL.prototype._parseWhere = function(whereParams, params){
    if (!whereParams) return '';

    var sql     = ''
        , templ = ' %s tb%s.%s %s %s ';
    whereParams.forEach(function(where){

        // Where digitado
        if (typeof where == 'string'){
            sql += ' ' + where + ' ';

        // Where composto
        } else {

            // ["AND", '0', "map_filiais_key", "check"]
            if (where.length == 4){
                var flag    = where.pop()
                    , val   = params[where[2]]
                ;

                if (val == 'NEW_KEY' || (!val && flag.toUpperCase() == 'GET')){
                    val = -999;
                }

                if (val){
                    where.push('=');
                    where.push("'" + val + "'");

                } else {
                    where = [];
                }
            }

            if (where.length){
                where.unshift(templ);
                sql += util.format.apply(util, where);
            }

        }
    });

    // Retorna
    return sql;
};


/**
 * Processa req.query e alimenta search
 * @param query { string }
 */
SQL.prototype._parseSearch = function(sqlParams, query){
    var sql     = ''
        , orig  = (typeof query == 'string'
                ? query
                : query.pop()
        )
        , qry   = orig.toLowerCase().split(' ')
        , exclude = ['o', 'a', 'e', 'do', 'da', 'das']
    ;

    if (typeof query == 'string'){
        qry = [query];
    }

    var glue = ' AND ', maior = false, menor = false;
    sqlParams['search'].forEach(function(param){

        switch (param.param.toUpperCase()) {

            case 'LIKE FULL':
                var abre = " ( ";
                qry.forEach(function (q) {
                    if (q.length > 3) {
                        sql += glue + abre + 'tb' + param.alias + '.' + param.field + " LIKE '%" + q + "%'";
                        glue = ' OR ';
                        abre = "";
                    }
                });
                if (orig.length > 3) {
                    sql += glue + 'tb' + param.alias + '.' + param.field + " LIKE '%" + orig + "%'";
                }
                sql += abre ? "" : " ) ";
                break;

            case 'LIKE':
                sql += glue + 'tb' + param.alias + '.' + param.field + " LIKE '%" + orig + "%'";
                break;
            
            case 'LIKE INICIO':
                sql += glue + 'tb' + param.alias + '.' + param.field + " LIKE '%" + orig + "'";
                break;

            case 'LIKE FIM':
                sql += glue + 'tb' + param.alias + '.' + param.field + " LIKE '" + orig + "%'";
                break;

            case 'IN':
                sql += glue + 'tb' + param.alias + '.' + param.field + " IN ('" + qry.join("', '") + "')";
                break;

            case '=':
                sql += glue + 'tb' + param.alias + '.' + param.field + " = '" + orig + "' ";
                break;

            case '>':
            case '>=':
                if (!maior) {
                    maior = true;
                    qry.forEach(function (q) {
                        if (util.isNumber(q) || isDate(q)) {
                            sql += glue + 'tb' + param.alias + '.' + param.field + " > '" + q + "'";
                            glue = ' OR ';
                        }
                    });
                }
                break;

            case '<':
            case '<=':
                if (!menor) {
                    menor = true;
                    qry.forEach(function (q) {
                        if (util.isNumber(q) || isDate(q)) {
                            sql += glue + 'tb' + param.alias + '.' + param.field + " < '" + q + "'";
                            glue = ' OR ';
                        }
                    });
                }
                break;

            default:
                qry.forEach(function (q) {
                    sql += glue + 'tb' + param.alias + '.' + param.field + " " + param.param + " '" + q + "'";
                    glue = ' OR ';
                });
                break;
        }
    });

    return sql;
};


//endregion


//region :: CRUD

/**
 * Executa o parsing do provider, e se for um select para insert
 * interrompe o processo enviando um row default para o client.
 * @param provider
 * @param obj { BizObject }
 * @private
 */
SQL.prototype._select = function *(provider, obj, meta){

    // Pacote de retorno
    var data = getDataPack()
        , sql = ''
        , new_key = false
        , sqlParams = getSqlParams()
    ;

    // Ajusta sqlParams
    if (typeof provider == 'string') {
        sql = provider;
    } else {
        sqlParams = this.db.parseProvider(provider, obj);
        new_key = (sqlParams.key.val == 'NEW_KEY');
    }
    
    // Row de insert
    if (new_key){
        var row = {_key_: 'NEW_KEY'};
        for (var f in sqlParams.fields) {
            var val = ''
                , tipo = sqlParams.meta[f]['tipo'] || {}
                , def = tipo['default']
                , type = tipo['type']
                ;
            def = (typeof def == 'string' ? def.toUpperCase() : def);

            // Monta valores
            switch (type) {
                case 'int':
                    val = def || 0;
                    break;

                case 'float':
                case 'money':
                case 'percent':
                    val = def || '0,00';
                    break;

                case 'date':
                    if (def == 'NOW' || def == 'DATE' || def == 'HOJE') {
                        val = moment().format("YYYY-MM-DD");
                    }
                    break;

                case 'time':
                    if (def == 'NOW' || def == 'DATE' || def == 'HOJE') {
                        val = moment().format("HH:mm:ss");
                    }
                    break;

                case 'timestamp':
                case 'datetime':
                    if (def == 'NOW' || def == 'DATE' || def == 'HOJE') {
                        val = moment().format("YYYY-MM-DDTHH:mm:ss");
                    }
                    break;

                default:
                    val = (def ? def : val);
            }
            row[f] = (val == 'NEW_KEY' ? '' : val);
        }

        data.rows.push(row);
        return data;

    // Normal
    } else {
        sql = sql || this.db.parseSQL(sqlParams, obj);
        
        var results = yield this.db._exec(sql, obj);
        
        return yield this.db.processResults(sqlParams, results || [], obj, sql, meta);
    }
};

/**
 * Processamento default de resultado de selects
 * @param results
 * @param sql
 */
SQL.prototype._processResults = function *(sqlParams, results, obj, sql, meta){
    meta = meta || {};
    var ndx   = {}
        , key = (sqlParams['key'] && sqlParams.key.field
            ? sqlParams.key.field
            : meta['key']
                ? meta.key
                : ''
        )
        , onGetRow  = obj['onGetRow']
        , db        = this
        , data      = getDataPack()
    ;
    data.key = key;

    // Verifica datetimes
    var formats = [], check = ['date', 'time', 'datetime', 'timestamp'];
    if (sqlParams['meta']){
        for(var m in sqlParams['meta']){
            if (check.indexOf(sqlParams['meta'][m].tipo.type) > -1){
                formats.push({field: m, tipo: sqlParams['meta'][m].tipo.type});
            }
        }
    }

    // Processa
    for (var i = 0; i<results.length; i++){
        var row = results[i];

        // Monta indice
        row._key_ = row[key];
        data.index[row._key_] = i;

        // Em raros casos onde não houver fields pro sql, será forçado um '*', e
        // essa entrada aqui garantirá que todos os fields fiquem em lower
        if (sqlParams['force_lower']){
            var k, keys = Object.keys(row);
            var n = keys.length;
            var newobj = {};
            while (n--) {
                k = keys[n];
                newobj[k.toLowerCase()] = row[k];
            }
            row = newobj;
        }

        formats.forEach(m => {
            switch (m.tipo){
                case 'date':
                    row[m.field] = row[m.field] != null ? moment(row[m.field]).format("YYYY-MM-DD") : '';
                    break;

                case 'time':
                    row[m.field] = row[m.field] != null ? moment(row[m.field]).format("HH:mm:ss") : '';
                    break;

                case 'timestamp':
                case 'datetime':
                    row[m.field] = row[m.field] != null ? moment(row[m.field]).format("YYYY-MM-DDTHH:mm:ss") : '';
                    break;
            }
        });


        if (onGetRow) {
            yield onGetRow(row);
        }

        data.rows.push(row);
    }

    // Página
    data.page = (sqlParams.limit
        ? sqlParams.limit.page +1
        : meta['limit'] && meta.limit['page']
            ? meta.limit.page
            : 1
    );

    // ShowSQL
    if (sqlParams.showSQL) {
        data['sql'] = sql;
        log.msg('SQL gerado:', sql);
    }

    // Retorna
    return data;
};

/**
 * Executa uma operação de UPDATE ou INSERT
 * @param op
 * @param provider
 * @param obj
 * @returns {*}
 */
SQL.prototype.change = function *(op, provider, obj) {
    var results
        , ok = false
    ;

    // Ajusta sqlParams
    if (typeof provider == 'string') {
        return log.erro('Para operações de change deverá ser informado um provider.', provider);
    }

    // Verifica values
    if (op != 'del'&& !obj.params['row']){
        return log.erro('Não foi possível encontrar os "row" com valores para o "' + (op == 'upd' ? 'update' : 'insert') + '" no contexto fornecido.');
    }

    // Processa provider
    for(var s in provider.sources) {
        var source = provider.sources[s].src
            , sql = ''
            , key = provider.sources[s]['key'] || source.metadata.key
            , fields = ''
            , values = ''
            , v = ''
        ;

        switch (op){
            case 'upd':
                sql = ' UPDATE ' + source.table + ' SET ';
                break;

            case 'ins':
                sql = ' INSERT INTO ' + source.table;
                break;

            case 'del':
                sql = ' DELETE FROM ' + source.table;
                break;
        }

        if (op != 'del') {
            for (var f in source.metadata.fields) {
                if (f != key && obj.params.row[f]) {
                    var value = obj.params.row[f];

                    // Trata formatação de tipos
                    switch (source.metadata.fields[f].tipo.type) {
                        case "bool":
                            if (value === true || value === false || value == 'true' || value == 'false'){
                                value = (!value || value == 'false' ? 0 : 1);
                            }
                            break;

                        case "date":
                            value = (value == 'Invalid date' ? null : this.db.formatDateIn(value));
                            break;

                        case "datetime":
                        case "timestamp":
                            value = (value == 'Invalid date' ? null : this.db.formatDateTimeIn(value));
                            break;

                        default:
                            value = "'" + value + "'";
                    }

                    // SQL
                    if (op == 'upd') {
                        sql += '\n    ' + v + ' ' + f + " = " + value + " ";

                    } else {
                        fields += v + ' ' + f;
                        values += v + " " + value + " ";
                    }

                    v = ',';
                }
            }
        }

        // Processa where
        if (op != 'ins') {
            sql += '\n  WHERE ' + key + " = '" + obj.params.row[key] + "' ";
            sql += this.db.parseWhere(provider.sources[s]['where'], obj.params);

        } else {
            sql += ' (' + fields + ' ) ';
            sql += '\n    VALUES (' + values + ') ';
        }

        // Executa
        results = yield this.db._exec(sql, obj);
        ok = yield this.db.processChangeResults(op, results, obj);
    }

    return ok;
};

/**
 * Executa um UPDATE com base em sqlParams
 * @param provider
 * @param obj { BizObject }
 */
SQL.prototype._update = function *(provider, obj){
    return yield this.change('upd', provider, obj);
};

/**
 * Executa um INSERT com base em sqlParams
 * @param provider
 * @param obj { BizObject }
 */
SQL.prototype._insert = function *(provider, obj){
    return yield this.change('ins', provider, obj);
};

/**
 * Executa um DELETE com base em sqlParams
 * @param provider
 * @param obj { BizObject }
 */
SQL.prototype._delete = function *(provider, obj){
    return yield this.change('del', provider, obj);
};


//endregion


module.exports = SQL;