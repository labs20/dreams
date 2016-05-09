'use strict';

var send        = require('koa-send')
    , path      = require('path')
    , fs        = require('fs-extra')
;


/**
 * Engine de aplicações - TShark.
 *   Serve arquivos estáticos, cuidando que arquivos js e css sejam servidos
 * implementando composição e overwrite.
 *
 *   Se o mesmo arquivo css ou js existir em multiplos paths,
 *      ex: appone/myapp/js/teste.js e appone/_common/js/teste.js
 *
 *   Ele será carregado por padrão do path mais baixo para o path mais alto,
 *   fazendo concatenação com os arquivos encontrados.
 *
 *   Para alterar o fluxo, requisite o arquivo com '?flow=[up|down]'
 *   Para evitar a concatenação, e retornar o primeiro encontrado,
 *   requisite o arquivo com '?over=1'
 * @param opts {{caching: false, log: false}}
 * @author labs
 * @since 10/04/2016
 * @constructor
 */
module.exports = function(opts) {
    let options = opts || {};
    let log = options.log || false;
    let caching = options.caching || false;
    let ts_path = options.inside_node ? 'node_modules/' : '';
    options.root = './';

    let cookies = require('./cookie');

    let cache = {};
    return function*(next) {
        try {
            var p       = this.path
                , file  = path.parse(this.path)
            ;

            if (!caching || !cache) {
                cache = {};
            }

            if (!cache[p]) {
                cache[p] = [];
                var arq = 'web' + p;
                if (fs.existsSync(arq)) {
                    cache[p].push(arq);
                }
            }

            var sent = false;
            if (cache[p].length == 1) {
                try {
                    sent = yield send(this, cache[p][0], options);
                    if (sent) {
                        return;
                    } else {
                        return yield *next;
                    }
                } catch (e){
                    
                }
            } else {
                var buff = '', q = '';
                for (var i = 0; i < cache[p].length; i++) {
                    buff += q + fs.readFileSync(cache[p][i], 'utf8');
                    q = '\n\n\n';
                }
                if (file.ext == '.css'){
                    this.set('Content-Type', 'text/css; charset=utf-8');
                } else if (file.ext == '.js') {
                    this.set('Content-Type', 'application/javascript; charset=utf-8');
                    buff += '\n\n//# sourceURL=' + p
                }
                this.body = buff;
            }
        } catch (e){
      //      console.log(e);
        }

    }
};
