/**
 * TShark - Client 3.0
 *  Implementação de client dataset.
 *
 * @copyright [== © 2016, Softlabs ==]
 * @link <a href="http://www.softlabs.com.br">Softlabs</a>
 * @author Luiz Antonio B. Silva [Labs]
 * @since 20/02/2016
 */
TShark.prototype.modulo = function(path){

    /**
     * Armazena this para ser usado em funções internas
     * @type {TShark}
     */
    var self = this;

    /**
     * Permite extender uma classe
     */
    this.extends = '';

    /**
     * Path domodulo
     * @type {*|string}
     */
    this.path = path || '';

    /**
     * Função de init, implementada em overwrite em modulos filhos
     */
    this.init = function(){

    };


    // Monta helper para usar APIs default em design com rv
    this.api = {};
    var api = this.path.replace(/\./g, ' ');
    for (var a in tshark.api_map){
        this.api[a] = api + ' ' + (a == 'exec' ? '' : a);
    }

    // Helper de APIs 'extras'
    this.api.save = api + ' save ';
    this.api.last_form_id = '';

    /**
     * Info do módulo
     * @type {{titulo: string, info: string, help: string, icon: string}}
     */
    this.info = {
        titulo: '',
        info: '',
        help: '',
        icon: ''
    };

    /**
     * Dataset do modulo
     * @type { Dataset }
     */
    this.data = new Dataset(this.path, this);
    
    /**
     * Armazena dados temporários através da função send.
     * É resetado após o envio.
     * @type {{}}
     * @private
     */
    this._sending_ = {};

    /**
     * Templates do módulo
     * @type {{templ_name:''}}
     */
    this.templates = {};

    /**
     * Form para edição
     */
    this.form = {
        bounds: {},
        comps: {},
        obj: false
    };
};


/**
 * Implementação da classe
 */
(function() {

    //region :: Mensagens


    //region :: Soft

    /**
     * Gera log em console
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.modulo.prototype.log = function(msg, extra, onOk){
        return tshark.log(msg, extra, onOk);
    };

    /**
     * Exibe mensagem de erro na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.modulo.prototype.erro = function(msg, extra, onOk){
        return tshark.erro(msg, extra, onOk);
    };

    /**
     * Exibe mensagem de sucesso na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.modulo.prototype.sucesso = function(msg, extra, onOk){
        return tshark.sucesso(msg, extra, onOk);
    };

    /**
     * Exibe um alerta na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.modulo.prototype.alerta = function(msg, extra, onOk){
        tshark.alerta(msg, extra, onOk);
    };

    /**
     * Exibe uma mensagem na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.modulo.prototype.msg = function(msg, extra, onOk){
        tshark.msg(msg, extra, onOk);
    };

    //endregion

    //region :: Popup

    /**
     * Exibe popup de erro na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.modulo.prototype.popErro = function(msg, extra, onOk){
        return tshark.popErro(msg, extra, onOk);
    };

    /**
     * Exibe popup de sucesso na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.modulo.prototype.popSucesso = function(msg, extra, onOk){
        return tshark.popSucesso(msg, extra, onOk);
    };

    /**
     * Exibe um popup de alerta na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.modulo.prototype.popAlerta = function(msg, extra, onOk){
        tshark.popAlerta(msg, extra, onOk);
    };

    /**
     * Exibe um popup na tela
     * @param msg
     * @param extra
     * @param onOk
     */
    TShark.prototype.modulo.prototype.popMsg = function(msg, extra, onOk){
        tshark.popMsg(msg, extra, onOk);
    };

    /**
     * Pede confirmação do usuário
     * @param msg Mensagem ao usuário
     * @param onOk { function } Callback em caso de sim
     * @param onCancel { function } Callback em caso de não
     */
    TShark.prototype.modulo.prototype.confirm = function(msg, onOk, onCancel){
        tshark.confirm(msg, onOk, onCancel);
    };

    /**
     * Pede ao usuário que informe um valor.
     * @param msg Mensagem ao usuário
     * @param defValue Valor default
     * @param onOk { function } Callback em caso de sim
     * @param onCancel { function } Callback em caso de não
     */
    TShark.prototype.modulo.prototype.prompt = function(msg, defValue, onOk, onCancel){
        tshark.prompt(msg, defValue, onOk, onCancel);
    };

    //endregion

    //endregion


    //region :: Chamadas de API diretas

    /**
     * Executa chamadas de api direto via call.
     *  Ex: mod.call('list', {provider: 'provTeste'})
     * @param api
     * @param data
     */
    TShark.prototype.modulo.prototype.call  = function(api, data){
        data = data || {};
        data.action = (this.api[api]
            ? this.api[api]
            : this.api['exec'] + api
        );

        $('#_direct_api_helper_')
            .data(data)
            .api('query');
    };


    /**
     * Executa uma api search
     * @param data
     */
    TShark.prototype.modulo.prototype.search = function (data){
        this.call('search', data);
    };
    
    /**
     * Executa uma api get
     * @param data
     */
    TShark.prototype.modulo.prototype.get = function (data){
        this.call('get', data);
    };

    /**
     * Executa uma api list
     * @param data
     */
    TShark.prototype.modulo.prototype.list = function (data){
        this.call('list', data);
    };


    /**
     * Executa uma api create
     * @param data
     */
    TShark.prototype.modulo.prototype.create = function (data){
        this.call('create', data);
    };
    
    /**
     * Executa uma api edit
     * @param data
     */
    TShark.prototype.modulo.prototype.edit = function (data){
        this.call('edit', data);
    };



    /**
     * Executa uma api exec
     * @param func
     * @param data
     */
    TShark.prototype.modulo.prototype.exec = function (func, data){
        this.call(func, data);
    };
    
    /**
     * Executa uma api insert
     * @param data
     */
    TShark.prototype.modulo.prototype.insert = function (data){
        this.call('insert', data);
    };
    
    
    /**
     * Executa uma api update
     * @param data
     */
    TShark.prototype.modulo.prototype.update = function (data){
        this.call('update', data);
    };
    
    /**
     * Executa uma api delete
     * @param data
     */    
    TShark.prototype.modulo.prototype.delete = function (data){
        this.call('delete', data);
    };
    
    /**
     * Executa uma api save
     * @param data
     */
    TShark.prototype.modulo.prototype.save = function (data){
        this.call('save', data);
    };


    /**
     * Carrega dados diretamente da API list de path
     * @param data {{}} (opcional)
     * @param load_api {string} (opcional) Se 1 ou 4 strings, tratado como exec, senão como list
     * @param callback {function} (opcional) função para execução ao final do load
     * @returns {*}
     */
    TShark.prototype.modulo.prototype.load = function () {
        this.data.load(arguments);
    };






    TShark.prototype.modulo.prototype.zzzload = function (load_api) {
        load_api = load_api || this.path.split('.');
        if (typeof load_api == 'string') {
            load_api = load_api.split(' ');
        }

        // Executa chamada
        var self = this;
        $.ajax(load_api.join("/"), {})

            // Processa retorno
            .done(function (data) {
                if (self['onLoad']) {
                    self.onLoad(data);
                }

                self.data.reset(data);

                if (self['onAfterLoad']) {
                    self.onAfterLoad();
                }
            });
    };

    //endregion


    //region :: Interceptação de eventos de API

    /**
     * A API save é uma api de mentirinha. Aqui no módulo, descobre-se qual a real
     * natureza da operação, e retorna-se uma alteração da chamada de API.
     * @param sender
     * @param settings
     * @returns {boolean}
     */
    TShark.prototype.modulo.prototype.save_before = function (sender, settings) {
        if (!this.data.row){
            console.error(this.path + ': save_before -> data.row não definido');
            return false
        }

        // Passa valores
        settings.data.row = this.data.row;

        // Insert
        if (this.data.row['_key_'] == 'NEW_KEY'){
            return 'insert';

        // Update
        } else {
            if (!this.data.key){
                console.error(this.path + ': save_before -> data.key não definido');
                return false
            }

            $(sender).data('key', this.data.row[this.data.key]);
            settings.data.key = this.data.row[this.data.key];
            return 'update';
        }
    };

    //endregion

    
    //region :: Envio de dados ao server


})($);
