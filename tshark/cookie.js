/**
 * Created by labs on 15/04/16.
 */
function Cookie(opts){
    this.keys = {
        logged_user     : '707f49254607f5981f11244d423936ec',
        running_session : '01821914ff3707f1ae3b90c2d1068f64'
    };

    this.quiet = opts && opts['quiet'] || true;
}

const crypto = require('crypto')
    , log = require('./_log')
;

/**
 * Cria chave única para cookie de usuário
 * @param ctx
 * @param client
 * @returns {string}
 */
Cookie.prototype.userKey = function(ctx, client) {
    var hash  = crypto.createHash('sha256')
        , tmp = []
        , res = ''
    ;

    try {
        if (!client) {
            tmp = ctx.req.headers.referer.split('/').slice(-2);
            client = tmp.join('/');
        } else {
            tmp = client.split('/');
        }

        client += (ctx.app.context.clientes[tmp[0]][tmp[1]].security.active
                ? ctx.app.context.clientes[tmp[0]][tmp[1]].security.mode
                : ''
        );

        hash.update(client);
        res = hash.digest('hex') + this.keys.logged_user;

    } catch (e){
        if (!this.quiet) {
            log.erro(e);
        }
    }

    return res;
};

/**
 * Retorna cookie do usuário logado
 * @param ctx
 * @param client
 */
Cookie.prototype.getLoggedUser = function(ctx, client) {
    var hash = crypto.createHash('sha256')
        , key = this.userKey(ctx, client)
    ;

    return ctx.cookies.get(key);
};

/**
 * Seta cookie com usuário logado
 * @param ctx
 * @param client
 * @param value
 */
Cookie.prototype.setLoggedUser = function(ctx, client, value) {
    var hash = crypto.createHash('sha256')
        , key = this.userKey(ctx, client)
    ;

    value = this.keys.running_session + (value || (ctx.ip + Date.now() + (Math.random() * (500 - 1) + 1)));
    hash.update(value);
    value  = hash.digest('hex');

    ctx.cookies.set(key, value);
    
    return value;
};

/**
 * Remove o cookie de usuário logado
 * @param ctx
 * @param client
 */
Cookie.prototype.clearCoockie = function(ctx, client){
    var hash = crypto.createHash('sha256')
        , key = this.userKey(ctx, client)
    ;
    ctx.cookies.set(key, '', {expires: new Date(1), path: '/'});
};

// Exporta
module.exports = new Cookie();