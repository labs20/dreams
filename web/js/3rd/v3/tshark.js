/**
 * TShark - Client 3.0
 *  Implementação de client baseado em Semantic UI.
 *
 * @copyright [== © 2015, Softlabs ==]
 * @link <a href="http://www.softlabs.com.br">Softlabs</a>
 * @author Luiz Antonio B. Silva [Labs]
 * @since 06/10/2015
 */
function TShark(opts){
    opts = opts || {};
    this.clickevent = opts['clickevent'] || 'click';

    // Módulos
    this._tmp_ = {};
    this.modulos = {};
    this.modulos._add = function(id, mod){
        tshark._tmp_[id] = mod;
    };

    /**
     * Armazena os rivet binds que forem associados
     */
    this.bounded = {};
    
}

// Globals
var CONSOLE_ON = true;

/**
 * Implementação da classe
 */
(function() {

    //region :: Inicialização

    /**
     * Inicializa o TShark client realizando os binds iniciais
     * @since 06/10/15
     */
    TShark.prototype.init = function (options) {
        options = options || {};

        // Bind de APIs generico
        var d = $("<div>", {
            id: '_direct_api_helper_',
            class: "ui hidden"
        }).api(this.api);

        $('body')
            .append(d);
        
        if(options['register']){
            this.register(options['register']);
        }

        // bind
        var id = '.app'
            , obj = app
        ;
        if (options['bind']){
            if (typeof options['bind'] == 'string') {
                this.bind(options['bind'], obj);

            } else {
                for (var o in options['bind']){
                    this.bind(o, options['bind'][o]);
                }
            }
        } else {
            this.bind(id, obj);
        }
    };

    /**
     * Ativa o semantic em ref
     * @since 06/10/15
     */
    TShark.prototype.initIntf = function (ref) {
        if (!ref) {
            ref = 'body';

        } else {
            if (typeof ref == 'string') {
                ref = (ref ? ref + ' ' : '');
                if (ref && (ref[0] != '#' && ref[0] != '.')) {
                    ref = "#" + ref;
                }

                ref = $(ref);
            }
        }

        // Bind de APIs
        $(ref).find('[data-action]').not('.api-binded')
            .api(this.api)
            .addClass('api-binded');

        
        // Bind Semantic
        $(ref).find('.ui.dropdown').not('.binded')
            .dropdown({
                onChange: function(value, text, $choice){

                    var dts = $(this).data('set');
                    if (dts){
                        dts = tshark.getObjPath(window, dts);
                        if (dts){
                            dts.goTo(value);
                        }
                    }

                    var _onChange = $(this).attr('on-change');
                    if (_onChange){
                        var obj = false;
                        if (typeof window[_onChange] == 'function'){
                            obj = window;
                            
                        } else if (dts){ 
                            if (typeof dts[_onChange] == 'function'){
                                obj = dts;
                                
                            } else if (dts.ref && typeof dts.ref[_onChange] == 'function'){
                                obj = dts.ref;
                            }
                        }
                        
                        if (obj){
                            obj[_onChange].call(this, value, text, $choice)
                        }
                            
                    }
                }
            })
            .addClass('binded')
        ;

        $(ref).find('.ui.menu.item').not('.binded')
            .state()
            .addClass('binded')
        ;

        $(ref).find('.checkbox').not('.binded')
            .checkbox()
            .addClass('binded')
        ;

        $(ref).find('[type=checkbox]').not('.binded')
            .checkbox()
            .addClass('binded')
        ;

        $(ref).find('.ui.accordion.non-exclusive').not('.binded')
            .accordion({
                exclusive: false
            })
            .addClass('binded')
        ;

        $(ref).find('.ui.accordion').not('.binded')
            .accordion()
            .addClass('binded')
        ;

        $(ref).find('[data-help]').not('.binded')
            .each(function(){
                $(this).attr('data-content', $(this).data('help'));
            })
            .popup()
            .addClass('binded')
        ;
        $(ref).find('[data-content]').not('.binded')
            .popup()
            .addClass('binded')
        ;

        $(ref).find('.ui.sticky').not('.binded')
            .sticky({
                offset: 90,
                bottomOffset: 5
            })
            .addClass('binded')
        ;

        $(ref).find('.special.cards .image').not('.binded')
            .addClass('binded')
            .dimmer({
                on: 'hover'
            })
        ;
    };

    /**
     * Remove links de api
     * @since 06/10/15
     */
    TShark.prototype.resetIntf = function (ref) {
        if (!ref) {
            ref = 'body';

        } else {
            if (typeof ref == 'string') {
                ref = (ref ? ref + ' ' : '');
                if (ref && (ref[0] != '#' && ref[0] != '.')) {
                    ref = "#" + ref;
                }
                ref = $(ref);
            }
        }

        $(ref).find('.binded')
            .removeClass('binded numpader-binded')
        ;
    };

    //endregion


    //region :: Binds

    /**
     * Executa um bind em uma área da interface, caso ela ainda 
     * não tenha um bound.
     * @param ref
     * @param obj
     * @param replace
     * @returns {*}
     */
    TShark.prototype.bind = function(ref, obj, replace) {
        var id = ref || 'body';

        if (!this.bounded[id] || !this.bounded[id].bound) {
            this.bounded[id] = {bound: false, html: $(id).html()};

            // Atualiza layout
            if (replace) {
                var container = (typeof replace == 'string'
                    ? id
                    : $(id).find(replace[0])
                );
                $(container)
                    .empty()
                    .append($(
                        (typeof replace == 'string'
                            ? replace
                            : replace[1]
                        )
                    ));
            }
            

            // Novo bind
            this.bounded[id].bound = rivets.bind($(id), obj);

            // Ajusta interface
            tshark.initIntf(ref);

            // Retorna
            return this.bounded[id];
        } 
    };

    /**
     * Refaz o bind de uma área, resetando o bind antigo caso 
     * ele exista.
     * @param ref
     * @param obj
     */
    TShark.prototype.rebind = function(ref, obj, replace) {
        var id = ref || 'body';

        // Refresh se já existir
        if (this.bounded[id]) {
            this.bounded[id].bound.unbind();
            this.bounded[id].bound = false;

            $(id).html(this.bounded[id].html);
        } 
        
        // Executa bind
        return this.bind(ref, obj, replace);
    };

    /**
     * Restaura o template original da área de interface e refaz 
     * o bind da área.
     * @param ref
     * @param obj
     * @param replace
     */
    TShark.prototype.resetBind = function(ref, obj, replace){
        var id = ref || 'body';

        // Refresh se já existir
        if (this.bounded[id]) {
            $(id).html(this.bounded[id].html);
        }

        return this.rebind(ref, obj, replace);
    };

    /**
     * Desfaz o bind de uma área, opcionalmente resetando template antigo.
     * @param ref {string}
     * @param reset {bool}
     */
    TShark.prototype.unbind = function(ref, reset) {
        var id = ref || 'body';

        // Desativa o bound
        if (this.bounded[id]) {
            this.bounded[id].bound.unbind();
            this.bounded[id].bound = false;

            if (reset) {
                $(id).html(this.bounded[id].html);
            }
        }
    };

    //endregion


    //region :: Módulos

    /**
     * Normaliza uma API para ser sempre array
     * @param api
     * @returns {[]}
     */
    function normalizeAPI(api) {

        // Garante array para API
        switch (typeof api) {
            case 'string':
                api = api.split('.');
                break;

            case 'object':
                api = [api[0], api[1], api[2]];
                break;
        }

        return api;
    }

    /**
     * Recupera um módulo, pelo seu id
     * @param path { string } Path 'owner.pack.mod'
     * @returns { TShark.modulo }
     */
    TShark.prototype.getMod = function (path) {
        if (typeof path != 'string'){
            path = path.join('.');
        }
        return this.modulos[path];
    };

    /**
     * Verifica se um módulo está registrado.
     * @param path {string}
     * @returns {boolean}
     */
    TShark.prototype.isRegistered = function (path) {
        return (this.modulos[path] ? true : false);
    };

    /**
     * Registra um módulo
     * @param paths { string || string[] } Path ou array de paths de objetos de negócio
     * @param callFunc { function() } Função que será executada após a carga do módulo
     * @since 21/02/16
     */
    TShark.prototype.register = function (paths, callFunc) {
        if (typeof paths == 'string'){
            paths = [paths];
        }

        paths.forEach(id => {

            // Ajusta path
            var obj = this.modulos[id];

            // Recupera módulo e instancía
            if (!obj || !obj['data']) {

                // Recupera modulo
                var path  = id.split('.')
                    , mod = path.pop()
                    , arq = "modulos/" + path.join('/') + '/' + mod + '/' + mod + ".js"
                ;
                $.getScript(arq)

                    // Achou
                    .done(function (data, textStatus) {

                        // Cria instância e merge com recebido
                        tshark.initMod(id);

                        // Chama função callback
                        if (callFunc) {
                            callFunc.call(tshark.modulos[id]);
                        }
                    })

                    // Falhou
                    .fail(function (jqxhr, settings, exception) {
                        //alertify.error("API não reconhecida: '" + map + "'");
                    })
                ;
            }

        });
    };

    /**
     * Instancia e extende um novo módulo
     * @param ref { TShark.modulo }
     */
    TShark.prototype.initMod = function (ref) {
        var path = '';

        if (typeof ref == 'string') {
            path = ref;
            ref = tshark._tmp_[ref];
            delete(tshark._tmp_[ref]);
        }

        // Extends definido no módulo
        var extra_extend = (ref && ref.extends && window[ref.extends] ? window[ref.extends] : {});

        // Cria com hierarquia
        var mod = $.extend(

            // Módulo TShark
            new tshark.modulo(path),

            // Objeto definido no módulo, se houver
            extra_extend,

            // BizObject
            ref || {}
        );

        // Registra no tshark
        tshark.modulos[path] = mod;

        // Registra no browser
        var obj = window
            , tmp = path.split('.')
        ;
        tmp.forEach((p, i) => {
            if (!obj[p]){
                obj[p] = (i == tmp.length-1
                    ? tshark.modulos[path]
                    : {}
                );
            }
            obj = obj[p];
        });

        // Registra no app
        obj = app;
        tmp.forEach((p, i) => {
            if (!obj[p]){
                obj[p] = (i == tmp.length-1
                        ? tshark.modulos[path]
                        : {}
                );
            }
            obj = obj[p];
        });

        // Inicializa
        if (mod['init']) {
            mod.init();
        }

        // Retorna
        return mod;
    };


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
        if (criou && final_obj) {
            obj = final_obj;
        }
        return criou;
    };


    /**
     * Retorna um subobjeto em base percorrendo path
     * @param base
     * @param path
     * @returns {*}
     */
    TShark.prototype.getObjPath = (base, path) => {
        var obj = base;
        if (typeof path == 'string'){
            path = path.split('.');
        }
        path.forEach((p) => {
            obj = obj[p];
        });
        return obj;
    };


    /**
     * Armazena dados para serem enviados ao server no próximo call
     * de API
     * @param data {{}} Dados a serem enviados
     * @param key {string} (Opcional) Se informado, os dados serão encontrados nessa chave em params no server
     */
    TShark.prototype.send = function (data, key) {
        this._sending_ = this._sending_ || {};
        if (key){
            this._sending_[key] = data;
        } else {
            this._sending_ = $.extend(this._sending_, data);
        }
    };

    /**
     * Alimenta o pacote de envio e reseta o _sending_
     * @param settings
     * @private
     */
    TShark.prototype._send = function (settings) {
        settings.data = $.extend(settings.data, this._sending_);
        this._sending_ = {};
    };
    
    //endregion


    //region :: Mensagens

    function notify(tipo, msg, extra, onOk){
        alertify.notify( msg, tipo, 5, onOk );
        if (extra){
            alertify.notify( extra, tipo );
        }
    }

    function log(msg, extra){
        if (console) {
            console.log(msg, extra);
            if (extra) {
                console.log(msg, extra);
            }
        }
    }

    function popAlert(title, msg, extra, onOk){
        alertify.alert(title, msg + (extra ? '<p>&nbsp;</p><p>' + extra : ''), onOk);
    }


    //region :: Suave

    /**
     * Gera um log em console
     * @param msg
     * @param extra
     */
    TShark.prototype.log = function(msg, extra){
        log(msg, extra);
    };

    /**
     * Exibe mensagem de erro na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.erro = function(msg, extra, onOk){
        notify('error', msg, extra, onOk);
        return false;
    };

    /**
     * Exibe mensagem de sucesso na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.sucesso = function(msg, extra, onOk){
        notify('success', msg, extra, onOk);
        return true;
    };

    /**
     * Exibe um alerta na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.alerta = function(msg, extra, onOk){
        notify('warning', msg, extra, onOk);
    };

    /**
     * Exibe uma mensagem na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.msg = function(msg, extra, onOk){
        notify('', msg, extra, onOk);
    };

    //endregion


    //region :: Popups

    /**
     * Exibe popup de erro na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.popErro = function(msg, extra, onOk){
        popAlert('Erro!', msg, extra, onOk);
        return false;
    };

    /**
     * Exibe popup de sucesso na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.popSucesso = function(msg, extra, onOk){
        popAlert('Sucesso!', msg, extra, onOk);
        return true;
    };

    /**
     * Exibe um popup na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.popAlerta = function(msg, extra, onOk){
        popAlert('Alerta!', msg, extra, onOk);
    };

    /**
     * Exibe um popup na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.popMsg = function(msg, extra, onOk){
        popAlert('Atenção!', msg, extra, onOk);
    };

    /**
     * Pede confirmação do usuário
     * @param msg Mensagem ao usuário
     * @param onOk { function } Callback em caso de sim
     * @param onCancel { function } Callback em caso de não
     */
    TShark.prototype.confirm = function(msg, onOk, onCancel){
        alertify
            .confirm('Atenção!', msg, onOk, onCancel)
            .set('labels', {cancel: 'Cancelar'})
        ;
    };

    /**
     * Pede ao usuário que informe um valor.
     * @param msg Mensagem ao usuário
     * @param defValue Valor default
     * @param onOk { function } Callback em caso de sim
     * @param onCancel { function } Callback em caso de não
     */
    TShark.prototype.prompt = function(msg, defValue, onOk, onCancel){
        alertify
            .prompt('Informe:', msg, defValue, onOk, onCancel)
            .set('labels', {cancel: 'Cancelar'})
        ;
    };


    //endregion



    //endregion

})($);
