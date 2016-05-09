/**
 * Conector ao MySQL baseado em seriate.
 * @see <a href="https://github.com/LeanKit-Labs/seriate">Seriate</a>
 * @author labs
 * @since 10/03/2016
 * @param connParams Parâmetros de conexão
 * @constructor
 */
function *MySql(connParams){

    /**
     * Driver de acesso a bancos SQL
     * @type {SQL}
     */
    this.driver = new driver(this);

    // Inicializa
    this.driver.init(connParams);

    // Conexão
    this.pool = mysql.createPool(connParams.conn);

    return this;
}

//region :: Includes

var driver  = require('./_sql')
    , mysql = require('koa-mysql')
    , log   = require('../_log')
;

//endregion


//region :: Parsing

/**
 * Recebe um sqlParams e monta um SELECT statement
 * @param sqlParams { sqlParams }
 * @param obj { BizObject }
 */
MySql.prototype.parseSQL = function(sqlParams, obj){
    var sql = '', fields = '', v = '';

    for (var fld in sqlParams.fields){
        if (fld == '__as__'){
            sqlParams.fields[fld].forEach((f) => {
                fields += v + f;
                v = ' ,';
            });
        } else {
            fields += v + sqlParams.fields[fld] + '.' + fld;
        }
        v = ' ,';
    }

    sql += ' SELECT ' + sqlParams.distinct + ' ';
    sql += fields || '*';
    sqlParams.force_lower = !fields;

    sql += '\n    FROM ' + sqlParams.table + ' ' + sqlParams.alias;
    sql += '\n' + sqlParams.joins.join('\n');
    sql += '\n  WHERE 1=1 ';

    // Processa where
    sql += this.parseWhere(sqlParams.where, obj.params);

    // Processa search
    if (sqlParams['search'] && obj.params['query']){
        sql += this.parseSearch(sqlParams, obj.params['query']);
    }

    if (sqlParams.group.length){
        sql += '\n  GROUP BY ' + sqlParams.group.join(', ');
    }
    if (sqlParams.having.length){
        sql += '\n  HAVING ' + sqlParams.having.join(', ');
    }
    if (sqlParams.order){
        sql += '\n  ORDER BY ' + sqlParams.order;
    }

    if (sqlParams.limit.max){
        sql += ' LIMIT ' + sqlParams.limit.page  + ', ' + sqlParams.limit.max;
    }
    
    return sql;
};


/**
 * Processa um provider e o transforma em sqlParams
 * @param provider {{
 *      sources: {
 *          0: {
 *              from: ['', '']
 *              join: {source: 0, tipo: 'inner', on: 'map_filiais_key', where: ''},
 *              fields: []
 *          }
 *      },
 *      where: [
 *          ['AND', 0, 'field', '=', 'value']
 *      ],
 *      order: [],
 *      group: [],
 *      having: [],
 *      limit: 100,
 *      showSQL: false
 * }}
 * @param obj { BizObject }
 */
MySql.prototype.parseProvider = function(sqlParams, provider, obj){
    return this.driver._parseProvider(sqlParams, provider, obj);
};


/**
 * Ajusta fields em sqlParams
 * @param prov
 * @param ctx_fields
 * @param meta_fields
 * @param alias
 */
MySql.prototype.parseFields = function(sqlParams, prov, ctx_fields, meta_fields, alias){
    return this.driver._parseFields(sqlParams, prov, ctx_fields, meta_fields, alias);
};


/**
 * Identifica os joins
 * @param join { {source: 0, tipo: 'inner', on: 'map_filiais_key', where: ''} }
 * @param table
 * @param alias
 * @param nolock
 */
MySql.prototype.parseJoin = function(sqlParams, join, table, alias, nolock) {
    return this.driver._parseJoin(sqlParams, join, table, alias, ' ');
};


/**
 * Processa req.query e alimenta where
 * @param req { req }
 * @returns { string }
 */
MySql.prototype.parseWhere = function(whereParams, params){
    return this.driver._parseWhere(whereParams, params);
};


/**
 * Processa req.query e alimenta search
 * @param req { req }
 * @returns { string }
 */
MySql.prototype.parseSearch = function(sqlParams, query){
    return this.driver._parseSearch(sqlParams, query);
};

//endregion


//region :: Formatação

function formatDateTimeIn(value, format){
    value = value.replace('T', ' ');
    value = value.replace('.000Z', '');

    var dt = value.replace('-', '/');
    if (dt[2] == '/'){
        return "STR_TO_DATE( '" + dt + "', '" + format + "')";
    } else {
        return "'" + value + "'";
    }
}

/**
 * Formata um valor para data para salvar no banco
 * @param value
 * @returns {string}
 */
MySql.prototype.formatDateIn = function(value){
    return value == formatDateTimeIn(value, '%d/%m/%Y');
};

/**
 * Formata um valor para data e hora para salvar no banco
 * @param value
 * @returns {string}
 */
MySql.prototype.formatDateTimeIn = function(value){
    return formatDateTimeIn(value, '%d/%m/%Y %H:%i:%s');
};

//endregion


//region :: Execução

/**
 * Executa um SELECT com base em sqlParams
 * @param provider
 * @param obj { BizObject }
 */
MySql.prototype.select = function *(provider, obj){
    return yield this.driver._select(provider, obj);
};

/**
 * Roda um SQL direto na base
 * @param sql {string}
 * @param obj {BizObject}
 * @param meta
 * @returns {Promise}
 */
MySql.prototype.query = function *(sql, obj, meta){
    return yield this.driver._select(sql, obj, meta);
};

/**
 * Executa um UPDATE com base em sqlParams
 * @param provider
 * @param obj { BizObject }
 */
MySql.prototype.update = function *(provider, obj){
    return yield this.driver._update(provider, obj);
};

/**
 * Executa um INSERT com base em sqlParams
 * @param provider
 * @param obj { BizObject }
 */
MySql.prototype.insert = function *(provider, obj){
    return yield this.driver._insert(provider, obj);
};

/**
 * Executa um DELETE com base em sqlParams
 * @param provider
 * @param obj { BizObject }
 */
MySql.prototype.delete = function *(provider, obj){
    return yield this.driver._delete(provider, obj);
};


/**
 * Executa o statement
 * @param sql
 * @returns {*}
 * @private
 */
MySql.prototype._exec = function *(sql){
    try {
        return yield this.pool.query(sql);

    } catch (e){
        log.erro(e, sql);
    }
};

/**
 * Processa o resultado do select ajustando o pacote de retorno.
 * @param results
 * @param sql
 */
MySql.prototype.processResults = function *(sqlParams, results, obj, sql, meta){
    return yield this.driver._processResults(sqlParams, results, obj, sql, meta);
};

/**
 * Processa o resultado de um INSERT ou UPDATE
 * @param results
 * @param obj
 * @returns {*|boolean}
 */
MySql.prototype.processChangeResults = function *(op, results, obj){
    var ok = false;

    if (results){
        if (op == 'upd'){
            ok = results['changedRows'];
        } else {
            ok = results['insertId']
        }
    }

    return ok;
    
};

//endregion


// Exporta
module.exports = MySql;