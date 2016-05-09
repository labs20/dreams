/**
 * Mecanismo de templates.
 * Implementa pesquisa, recuperação e parse de templates.
 * @author labs
 * @since 16/03/16.
 * @returns {Templates}
 * @constructor
 */
function Templates(){

    /**
     * Template renderizada
     * @type {string}
     */
    this.template = "";

    /**
     * Fields identificados em um template
     * @type {Array}
     */
    this.fields = [];

    // Chain
    return this;
}


/**
 * Renderiza e retorna um template, efetuando busca local ao app
 * e pegando default caso necessário.
 * @param templId Id da template
 * @param params
 * @param req
 * @returns html {string}
 */
Templates.prototype.render = function(templId, params, req){
    var jade    = require('jade')
        , fs    = require('fs-extra')
        , check = templId.split('.')
        , templ = ''
        , html  = ''
    ;

    if (!check || check.length != 2 || check[1] != 'jade'){
        templId += '.jade';
    }

    // Rastreia o template
    templ = req.app.server.findInPath(templId, 'views', req);
    if (templ){
       // try {
            html = jade.renderFile(templ, params);
        //} catch (e){
        //    req.throw(555, e.message);
        //}
    }

    // Reseta
    this.template = html;
    this.fields = this.parseFields(html);

    // Retorna
    return html;
};


/**
 * Recebe um template e processa o conteúdo extraindo 'row.[field]'
 * dele e retornando em um array
 * @param templ { string } Template a ser pesquisado
 * @param re { regex } Regular expression de tag (opcional, default para /row\.(\w+)/g
 * @returns {Array}
 */
Templates.prototype.parseFields = function(templ, re){
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


// Exporta
module.exports = new Templates();