/**
 * Log de desenvolvimento.
 * @author labs
 * @since 10/03/2016
 * @constructor
 */
function Log(){

}

/**
 * Gera mensages de erro de desenvolvimento no console
 * @param err
 */
Log.prototype.erro = function(err, extra) {
    this._console('Erro de Desenvolvimento:', err);
    if (extra){
        this._console('Contexto:', extra);
    } else {
        try{
            this._console('Stack:', err.stack);
        } catch (e){

        }
    }
    return false;
};

/**
 * Gera mensagem no console
 * @param tit
 * @param err
 */
Log.prototype.extra   = 
Log.prototype.msg     = 
Log.prototype.message = 
    function(tit, err) {
    this._console(tit, err);
};

/**
 * Gera mensagens no console
 * @param tit
 * @param err
 * @private
 */
Log.prototype._console = function(tit, err){
    var txt = '\n' + tit;
    txt += '\n' + pad('-', tit.length, '-');
    txt += '\n' + err;
    txt += '\n' + pad('-', tit.length, '-');
    console.log(txt);
};


var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;
function pad(str, len, pad, dir) {

    if (typeof(len) == "undefined") { var len = 0; }
    if (typeof(pad) == "undefined") { var pad = ' '; }
    if (typeof(dir) == "undefined") { var dir = STR_PAD_RIGHT; }

    if (len + 1 >= str.length) {

        switch (dir){

            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
                break;

            case STR_PAD_BOTH:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
                break;

            default:
                str = str + Array(len + 1 - str.length).join(pad);
                break;

        } // switch

    }

    return str;

}


// Exporta
module.exports = new Log();