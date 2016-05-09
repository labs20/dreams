/**
 * TShark 2.8
 * 
 * Biblioteca de extenções.
 * @copyright [== � 2014, Softlabs ==]
 * @link www.softlabs.com.br
 * @author Luiz Antonio B. Silva [Labs]
 * @since 08/12/14
 */

/**
 * Gera um número aleatório entre 0 e n que não se repete
 * em sequencia.
 * @author labs
 * @since 11/2014
 **/
var _last_rand_ = -1;
function rand(n){
    var r = Math.floor(Math.random()*n);
    if (r == _last_rand_) r = rand(n);
    _last_rand_ = r;
    return r;
}
Number.prototype.rand = function(){ return rand(this); }


/**
 * Retorna a string com a primeira letra em upper.
 * @author labs
 * @since 11/2014
 **/
function capitalize(str){
    return ($.type(str) === "string" ? str.charAt(0).toUpperCase() + str.slice(1) : str);
}
String.prototype.capitalize = function() {
    return capitalize(this);
}


/**
 * Retorna a string convertida em int.
 * @author labs
 * @since 11/2014
 **/
function toInt(valor){
    if (!valor) {
        return 0;
    }
    valor = valor.toString().replace(/[\s\D]/gm, '') + '';
    var res = parseInt(valor);
    return (res == NaN ? 0 : res);
}
String.prototype.toInt = function() {
    return toInt(this);
}


/**
 * Retorna a string convertida em float.
 * @author labs
 * @since 11/2014
 **/
function toFloat(valor){
    if (!valor) {
        return 0;
    }
    if (valor === true){
        return 1;
    }
    /*if (typeof valor != "string") {
        return valor;
    }*/

    valor = valor.toString().replace(/[\s\$a-zA-Z]/gm, '') + '';

    var r=/\.|,/gi;
    var keywords = valor.split(r);
    var decimal  = false;
    if (keywords.length>1) {
        decimal = keywords.pop();
    }
    var f = parseFloat(keywords.join('') + (decimal ? '.' + decimal : ''));
    return (isNaN(f) ? 0 : f);
}
String.prototype.toFloat = function() {
    return toFloat(this);
}
Number.prototype.toFloat = function() {
    return parseFloat(this);
}


/**
 * Retorna a string convertida em float.
 * @author labs
 * @since 11/2014
 **/
function isFloat(valor){
    if (!valor) {
        return 0;
    }
    if (valor === true){
        return 1;
    }
    /*if (typeof valor != "string") {
     return valor;
     }*/

    valor = valor.toString().replace(/[\s\$a-zA-Z]/gm, '') + '';

    var r=/\.|,/gi;
    var keywords = valor.split(r);
    var decimal  = false;
    if (keywords.length>1) {
        decimal = keywords.pop();
    }
    var f = parseFloat(keywords.join('') + (decimal ? '.' + decimal : ''));
    return !isNaN(f);
}
String.prototype.isFloat = function() {
    return isFloat(this);
}
Number.prototype.isFloat = function() {
    return parseFloat(this);
}


/**
 * Formata em moeda.
 * @author labs
 * @since 11/2014
 **/
Number.prototype.formatMoney = function(c, d, t){
    var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    var res = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t)
        + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");

    return res;
};
String.prototype.formatMoney = function(c, d, t){
    return toFloat(this).formatMoney(c,d,t)+'';
};

String.prototype.toMoney = function(c, d, t){
    return (this ? toFloat(this) : 0).formatMoney(c,d,t)+'';
};
Number.prototype.toMoney = function(c, d, t){
    return this.formatMoney(c,d,t);
};

function floatToStr(value){
    return toFloat(value).formatMoney();
}
String.prototype.floatToStr = function(c, d, t){
    return (this ? toFloat(this) : 0).formatMoney(c,d,t)+'';
};
Number.prototype.floatToStr = function(c, d, t){
    return this.formatMoney(c,d,t);
};

/**
 * Percentuais.
 * @author labs
 * @since 11/2014
 **/
function percentualDe(n, v, d){
    return (toFloat(n) * (toFloat(v)/100)).round(toFloat(d));
}
function percentualEm(n, v, d){
    return ((toFloat(n)*100)/toFloat(v)).round(toFloat(d));
}

Number.prototype.percentualDe = function(v, d){
    return percentualDe(this, v, d);
}
Number.prototype.percentualEm = function(v, d){
    return percentualEm(this, v, d);
}
Number.prototype.maisPercentualDe = function(v, d){
    return this + percentualDe(this, v, d);
}
Number.prototype.menosPercentualDe = function(v, d){
    return this - percentualDe(this, v, d);
}
Number.prototype.round = function(d){
    if (!d) d = 2;
    return Number(Math.round(this+'e'+d)+'e-'+d);
}

String.prototype.percentualDe = function(v, d) {
    return percentualDe(this, v, d);
}
String.prototype.percentualEm = function(v, d) {
    return percentualEm(this, v, d);
}
String.prototype.maisPercentualDe = function(v, d) {
    return toFloat(this) + percentualDe(this, v, d);
}
String.prototype.menosPercentualDe = function(v, d) {
    return toFloat(this) - percentualDe(this, v, d);
}

/**
 * Limita um string a um maximo de palavras.
 * @author labs
 * @since 11/2014
 **/
function maxWords(str, num, end){
    var ar = str.split(" ").slice(0, num);
    return ar.join(" ")+(end ? end : "");
}
String.prototype.maxWords = function(n, elipses) {
    return maxWords(this, n, elipses);
}


/**
 * Repete um string N vezes.
 * @author labs
 * @since 11/2014
 **/
function repeat(str, num){
    for (var x=0;x<parseInt(num);x++){
        str += '' + str;
    }
    return str;
}
String.prototype.repeat = function(n) {
    return repeat(this, n);
}
Number.prototype.repeat = function(n) {
    return repeat(this + '', n);
}


/**
 * Pad de string
 * @author labs
 * @since 11/2014
 **/
function strPad(str, chr, len, dir){
    if (str.length >= len) return str + '';

    var pad = (chr == null ? ' ' : '' + chr)
        .repeat(len - str.length)
        .substr(0, len - str.length);

    if (!dir || dir == 'right') return str + pad;
    if (dir == 'left') return pad + str;
}
String.prototype.pad    = function(chr, max, LEFT_RIGHT){
    return strPad(this, chr, max, LEFT_RIGHT);
}
Number.prototype.pad    = function(chr, max, LEFT_RIGHT) {
    return strPad(this+'', chr, max, LEFT_RIGHT);
}
String.prototype.strPad = function(chr, max, LEFT_RIGHT){
    return strPad(this, chr, max, LEFT_RIGHT);
}
Number.prototype.strPad = function(chr, max, LEFT_RIGHT) {
    return strPad(this+'', chr, max, LEFT_RIGHT);
}


/**
 * Transforma string "2014-06-02 00:00:00" em "02/06/2014"
 * @author labs
 * @since 11/2014
 **/
function _split_datetime(str, hora){
    var tmp = "",
        d = "//",
        h = "00:00:00"
    ;
    switch (str.length){
        case 19:
            tmp = str.split(" ");
            if (tmp.length > 1){
                if (tmp[0].search("[/|-]") > -1){
                    d = tmp[0];
                    h = tmp[1];
                } else {
                    h = tmp[0];
                    d = tmp[1];
                }
            } else {
                d = tmp[0];
            }
            break;

        case 10:
            d = str;
            break;

        case 8:
            h = str;
            break;
    }

    if (hora){
        return h.split(":");

    } else {
        var sep = (d.search("/") > -1 ? "/" : "-");
        tmp = d.split(sep);

        if (tmp[0].length == 4){
            return [tmp[2], tmp[1], tmp[0]];
        } else {
            return tmp;
        }
    }
}
String.prototype.fromDateTimeToDate  = function(){
    var d = _split_datetime(this);
    return d[0] + "/" + d[1] + "/" + d[2];
}
String.prototype.fromDateTimeToTime  = function(){
    var d = _split_datetime(this, true);
    return d[0] + ":" + d[1] + ":" + d[2];
}
String.prototype.fromDateTimeToDay   = function(){
    var d = _split_datetime(this);
    return d[0];
}
String.prototype.fromDateTimeToMonth = function(){
    var d = _split_datetime(this);
    return d[1];
}
String.prototype.fromDateTimeToYear  = function(){
    var d = _split_datetime(this);
    return d[2];
}


/**
 * Array Remove
 * @author John Resig (MIT Licensed)
 * @param from
 * @param to
 * @returns {Number}
 */
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

Array.prototype.first = function(){
    return (this.length ? this[0] : undefined);
};
Array.prototype.last = function(){
    return (this.length ? this[this.length-1] : undefined);
};

/**
 * Executa pivoteamento de um array de objetos por um
 * dos campos dos objetos no array
 *
 * Ex:
 *  res = [
 *    {dia: 'segunda', nome: 'Paulo', valor: 10},
 *    {dia: 'segunda', nome: 'Maria', valor: 20},
 *    {dia: 'terça',   nome: 'João',  valor: 15},
 *    {dia: 'quarta',  nome: 'Paulo', valor:  8},
 *  ].pivot('dia')
 *
 *  res =>
 *  [
 *      {
 *         _stats: { sum: {valor: 30}, count: 2 },
 *         label: 'segunda',
 *         values: [
 *              {dia: 'segunda', nome: 'Paulo', valor: 10},
 *              {dia: 'segunda', nome: 'Maria', valor: 20},
*          ]
*       },
 *      {
 *         _stats: { sum: {valor: 15}, count: 1 },
 *         label: 'terça',
 *         values: [
 *              {dia: 'terça',   nome: 'João',  valor: 15},
 *         ]
 *      },
 *      {
 *         _stats: { sum: {valor: 8}, count: 1 },
 *         label: 'quarta',
 *         values: [
 *              {dia: 'quarta',  nome: 'Paulo', valor:  8}
 *         ],
 *      }
 *  ]
 *   ... e
 *
 *   res._stats = { sum: {valor: 53}, count: 4 }
 *
 * @param campo
 * @returns {Array}
 */
Array.prototype.pivot = function (campo, desc) {
    var tipo, res = [], tmp = {}, first = true, sum = {}, count = 0, f;
    this.forEach(row => {
        var field = row[campo];

        if (!tmp[field]){
            tmp[field] = {
                _stats: {sum: {}, count: 0},
                label: field,
                values: []
            };
        }
        tmp[row[campo]].values.push(row);

        // SUM
        if (first){
            for(var fld in row){
                if (isFloat(row[fld])){
                    f = toFloat(row[fld]);
                    sum[fld] = toFloat(row[fld]);
                    tmp[field]._stats.sum[fld] = f;
                }
            }
        } else {
            for (var fld in sum) {
                f = toFloat(row[fld]);
                sum[fld] += f;
                if (!tmp[field]._stats.sum[fld]){
                    tmp[field]._stats.sum[fld] = f;
                } else {
                    tmp[field]._stats.sum[fld] += f;
                }
            }
        }

        tmp[field]._stats.count++;
        first = false;
    });

    // Monta resultado
    for (var t in tmp){
        res.push(tmp[t]);
    }

    // Stats global
    res._stats = {sum: sum, count: res.length};

    // Ordenação
    var order_by = 'label';
    if (typeof desc == 'string'){
        order_by = desc;
        desc = arguments[2];
    }

    // Retorna com sortBy
    return res.sortBy(order_by, desc);
};

/**
 * Ordena um array de objetos por um de seus campos, tentando
 * adivinhar o tipo correto para efetuar o sort.
 * @param field {string} campo a ser utilizado para o sort
 * @param order_by {string} (Opcional) ordenação descendente?
 * @param desc {bool} (Opcional) ordenação descendente?
 * @returns {Array}
 */
Array.prototype.sortBy = function (field, desc) {
    if (!this.length) return this;

    var i = 0, found = false, is_date = false, sample;
    //do {
        sample = getObjPath(this[i], field); // this[i][field];
        found = sample;
    //} while (i < this.length || found === false);


    if (sample) {

        if (typeof sample == 'number' || isFloat(sample)){
            this.sortByFloat(field, desc);

        } else {

            // Tenta identificar se o tipo é data
            if (sample.indexOf('/') > -1 || sample.indexOf('-') > -1) {
                [
                    'DD/MM/YYYY', 'DD/MM/YY', 'DD/MM', 'MM/YY', 'MM/YYYY',
                    'YYYY/MM/DD', 'YY/MM/DD', 'MM/DD', 'YY/MM', 'YYYY/MM',
                    'DD-MM-YYYY', 'DD-MM-YY', 'DD-MM', 'MM-YY', 'MM-YYYY',
                    'YYYY-MM-DD', 'YY-MM-DD', 'MM-DD', 'YY-MM', 'YYYY-MM'
                ].forEach(f => {
                    if (moment(sample, f).isValid()) {
                        is_date = true;
                    }
                });
            }

            if (is_date) {
                this.sortByDate(field, desc);

            } else {
                this.sortByText(field, desc);
            }
        }
    }

    return this;
};

/**
 * Organiza array de objetos por um campo de data
 * @param field {string} campo a ser utilizado para o sort
 * @param desc {bool} (Opcional) ordenação descendente?
 * @returns {Array}
 */
Array.prototype.sortByDate = function (field, desc) {
    this.sort(_sortDate.bind(null, field, desc));
    return this;
};

function _sortDate(field, desc, a, b) {
    var
        aa   = getObjPath(a, field)
        , bb = getObjPath(b, field)
        , sep = (aa.indexOf('/') > -1
            ? '/'
            : '-'
        )
        , tmp1 = aa.split(sep)
        , tmp2 = bb.split(sep)
        , dt1
        , dt2
    ;

    if (tmp1[0].length == 4){
        dt1 = tmp1.join('');
        dt2 = tmp2.join('');

    } else {
        dt1 = tmp1.reverse().join('');
        dt2 = tmp2.reverse().join('');
    }


    if (dt1==dt2) return 0;
    if (desc) {
        return (dt1<dt2 ? 1 : -1);
    } else {
        return (dt1<dt2 ? -1 : 1);
    }
}


/**
 * Organiza array de objetos por um campo de float
 * @param field {string} campo a ser utilizado para o sort
 * @param desc {bool} (Opcional) ordenação descendente?
 * @returns {Array}
 */
Array.prototype.sortByFloat = function (field, desc) {
    this.sort(_sortByFloat.bind(null, field, desc));
    return this;
};

function _sortByFloat(field, desc, a, b) {
    var aa   = toFloat(getObjPath(a, field))
        , bb = toFloat(getObjPath(b, field))
    ;

    if (aa==bb) return 0;
    if (desc) {
        return bb - aa;
    } else {
        return aa - bb;
    }
}


/**
 * Organiza array de objetos por um campo de float
 * @param field {string} campo a ser utilizado para o sort
 * @param desc {bool} (Opcional) ordenação descendente?
 * @returns {Array}
 */
Array.prototype.sortByText = function (field, desc) {
    this.sort(_sortByText.bind(null, field, desc));
    return this;
};

function _sortByText(field, desc, a, b) {
    var aa   = (a[field]).toUpperCase()
        , bb = (b[field]).toUpperCase()
    ;

    if (aa == bb) return 0;
    if (desc) {
        return (aa < bb ? -1 : 1);
    } else {
        return (aa > bb ? -1 : 1);
    }
}

function getObjPath(base, path){
    var obj = base;
    if (typeof path == 'string'){
        path = path.split('.');
    }
    path.forEach((p) => {
        obj = obj[p];
    });
    return obj;
}



function randomColor() {
    var max = 0xffffff;
    return '#' + Math.round( Math.random() * max ).toString( 16 );
};


/**
 * Retorna um (fake) GUID
 * @returns {string}
 */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


function sum(){
    var args = Array.prototype.slice.call(arguments);
    return (args.length
        ? args.reduce(function(a, b) {
                return a.toFloat() + b.toFloat();
            })
        : 0);
}


function hasProp(o, p){
    o = o || {};
    return o.hasOwnProperty(p);
}

// NEW selector
jQuery.expr[':'].Contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
};

// OVERWRITES old selecor
jQuery.expr[':'].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
};


Object.values = function(obj){
    var vals = [], keys = Object.keys(obj);
    keys.forEach(function(key){
        vals.push(obj[key]);
    }, this);
    return vals;
};


// Array Remove - By John Resig (MIT Licensed)
/*Array.prototype.sremove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};*/



//region :: Rivetjs


/**
 * Implementa variáveis fixas em each
 */
var oldEach = rivets.binders['each-*'].routine;
rivets.binders['each-*'].routine = function(el, value){
    var first = true, sum = {}, count = 0, avg = 0;
    if (value) {
        value.forEach( (v, i) => {
            count++;
            if (typeof v == "object") {
                v['_index_'] = i;
                v['_first_'] = first;
                v['_last_'] = false;
                
                // SUM
                if (first){
                    for(var p in v){
                        if (isFloat(v[p])){
                            sum[p] = toFloat(v[p]);
                        }
                    }
                    
                } else {
                    for(var s in sum){
                        sum[s] += toFloat(v[s]);
                    }
                }
                
                first = false;
            }
        });
        if (typeof  value[value.length - 1] == "object") {
            value[value.length - 1]['_last_'] = true;
        }
    }
    if (this.model != undefined && this.observer.key.path && this.model[this.observer.key.path]) {
        //this.model[this.observer.key.path]._stats = {sum: sum, count: count, avg: avg};
    }
    oldEach.call(this, el, value);
};

/*
// Formatadores
rivets.formatters.concat = function(value) {
    var sep = arguments[1]
        , args = Array.prototype.slice.call(arguments, 2)
        ;
    args.unshift(value);
    return args.join(sep);
};

rivets.formatters.mais = function(value) {
    var args = Array.prototype.slice.call(arguments, 1);
    return toFloat(value) + (args.reduce(function(a, b) {
            return toFloat(a) + toFloat(b);
        }, 0));
};

rivets.formatters.menos = function(value) {
    var args = Array.prototype.slice.call(arguments, 1);
    return toFloat(value) - (args.reduce(function(a, b) {
            return toFloat(a) + toFloat(b);
        }, 0));
};

rivets.formatters.plus = function(value) {
    var args = Array.prototype.slice.call(arguments, 1)
        , mult = args.reduce(function(a, b) {
            return toFloat(a) * (toFloat(b) ? toFloat(b) : 1);
        }, toFloat(value))
        ;
    return mult;
};

rivets.formatters.money = function(value){
    return (value != undefined ? value.toMoney() : '');
}

rivets.formatters.float = function(value){
    return (value != undefined ? value.toFloat() : '');
}

rivets.formatters.int = function(value){
    return (value != undefined ? value.toInt() : '');
}

rivets.formatters.menorQueZero = function(value){
    return (toFloat(value) < 0 ? true : false);
}

rivets.formatters.maiorQueZero = function(value){
    return (toFloat(value) > 0 ? true : false);
}

rivets.formatters.clearIfEmpty = function(value){
    return (value == "" ? null : value);
}

rivets.formatters.clearIfEmptyOrZero = function(value){
    return (value == "" || value == "0" || value == "0,00" ? null : value);
}

rivets.formatters.igualA = function(value) {
    var args = Array.prototype.slice.call(arguments, 1);
    return (value == args[0]);
};
rivets.formatters.diffDe = function(value) {
    var args = Array.prototype.slice.call(arguments, 1);
    return (value != args[0]);
};

rivets.formatters.in = function(value) {
    var args = Array.prototype.slice.call(arguments, 1);
    return (args.indexOf(value) > -1);
};
rivets.formatters.notIn = function(value) {
    var args = Array.prototype.slice.call(arguments, 1);
    return (args.indexOf(value) == -1);
};

rivets.formatters.or = function(value) {
    return (arguments[0] ? arguments[0] : arguments[1]);
};

rivets.formatters.not = function(value) {
    var args = Array.prototype.slice.call(arguments, 1);
    return !value;
};


rivets.adapters['#'] = {
    observe: function(obj, keypath, callback) {
        $(obj).on('change:' + keypath, callback);
        console.log(1);
    },
    unobserve: function(obj, keypath, callback) {
        $(obj).off('change:' + keypath, callback);
        console.log(2);
    },
    get: function(obj, keypath) {
        return $(obj).get(keypath);
        console.log(3);
    },
    set: function(obj, keypath, value) {
        $(obj).set(keypath, value);
        console.log(4);
    }
};
*/

//endregion