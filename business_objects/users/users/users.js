/**
 * BusinessObject :: Users
 *  Implementação de objeto de negócio: users.
 *
 * Engine de aplicações - TShark.
 * @since Mon May 09 2016 14:40:50 GMT-0300 (BRT)
 * @constructor
 */
function Users(){

    //region :: Definições do Objeto

    // Id
    this.id = 'users';

    // Map
    this.source = {
        table: 'users',
        metadata: {
            key: 'users_key',
            fields: {
                users_key: {
                    tipo: types.comp.key, label: 'Id:'
                },
                _public: {
                    tipo: types.comp.check, label: 'Público:', default: 0
                },
                _active: {
                    tipo: types.comp.check, label: 'Ativo:', default: 1
                },
                _banned: {
                    tipo: types.comp.check, label: 'Banned:', default: 0
                },
                _pending_pwd: {
                    tipo: types.comp.check, label: 'Senha Válida:', default: 0
                },
                _creation_date: {
                    tipo: types.comp.timestamp, label: 'Data Criação:'
                },
                _deactivation_date: {
                    tipo: types.comp.datetime, label: 'Data de Desativação:'
                },
                _suggested: {
                    tipo: types.comp.check, label: 'Sugerido:'
                },
                _token: {
                    tipo: types.comp.text, label: 'Token:'
                },
                _locale: {
                    tipo: types.comp.text, label: 'Locale:'
                },
                username: {
                    tipo: types.comp.text, label: 'Username:'
                },
                password: {
                    tipo: types.comp.text, label: 'Password:'
                },
                email: {
                    tipo: types.comp.text, label: 'Email:'
                },
                facebook_id: {
                    tipo: types.comp.text, label: 'Facebook Id:'
                },
                instagram_id: {
                    tipo: types.comp.text, label: 'Instagram Id:'
                },
                twitter_id: {
                    tipo: types.comp.text, label: 'Twitter Id:'
                },
                firstname: {
                    tipo: types.comp.text, label: 'Nome:'
                },
                lastname: {
                    tipo: types.comp.text, label: 'Sobrenome:'
                },
                gender: {
                    tipo: types.comp.dropdown, label: 'Sexo:',
                    data: {
                        key: ['gender'],
                        template: '{row.gender} - {row.label}',
                        rows: [
                            {gender: 'M', label: 'Masculino'},
                            {gender: 'F', label: 'Feminino'}
                        ]
                    }
                },
                birthday: {
                    tipo: types.comp.date, label: 'Nascimento:'
                },
                img_profile: {
                    tipo: types.comp.text_huge, label: 'Imagem Profile:'
                },
                img_background: {
                    tipo: types.comp.text_huge, label: 'Imagem Background:'
                },
                img_background_dreams_gallery: {
                    tipo: types.comp.text_huge, label: 'Imagem Galeria:'
                }
            }
        }
    };

    //endregion


    //region :: Forms

    this.forms = {

        // Form de update
        update:{
            _config: {
                bounds: { width: 800, height: 450 },
                labels: types.form.lines.labels.ontop,
                comps : types.form.lines.distribution.percent,
                state : types.form.state.ok,
                size  : types.form.size.small
            },
            linhas: [
                {titulo: "Usuário Dreams"},
                {users_key: 10, username: 25, password: 25, _pending_pwd: 10, _public: 10, _active: 10, _banned: 10},
                {firstname: 25, lastname: 25, gender: 15, email: 35},
                {birthday: 25, facebook_id: 25, instagram_id: 25, twitter_id: 25},
                {_creation_date: 40, _deactivation_date: 40},
                {img_profile: 50, img_background: 50},
                {device: 100},
            ],
            ctrls: {
                device: {
                    tipo: types.comp.text, label: 'Device:'
                }
            }
        }

    };

    //endregion


    //region :: Providers

    this.providers = {

        default  : {
            sources: {
                0: {
                    from: ['users', 'users'],
                    fields: [
                        'users_key', '_public', '_active', '_banned', '_pending_pwd',
                        '_creation_date', '_deactivation_date', '_token', '_locale', 'username', 'password',
                        'email', 'facebook_id', 'instagram_id', 'twitter_id',
                        'firstname', 'lastname', 'gender', 'birthday',
                        'img_profile', 'img_background', 'img_background_dreams_gallery'
                    ]
                }
            },
            where: [ 
                ['AND', 0, 'users_key', types.where.check],
                ['AND', 0, '_suggested', types.where.check],
                //['AND', 0, '_active', '=', 1],
                //['AND', 0, '_banned', '<>', 1]
            ],
            order: [
                ['0', 'users_key', 'desc']
            ],
            search: [
                {alias: 0, field: 'username',  param: types.search.like_full },
                {alias: 0, field: 'firstname',  param: types.search.like_full },
                {alias: 0, field: 'lastname',  param: types.search.like_full }
                
            ],
            limit: 250,
            showSQL: 0
        },

        login    : {
            sources: {
                0: {
                    from: ['users', 'users'],
                    fields: [
                        'users_key', '_public', '_pending_pwd', '_token',
                        'username', 'password', 'email', 'facebook_id', 'instagram_id', 'twitter_id',
                        'firstname', 'lastname', 'gender', 'birthday',
                        'img_profile', 'img_background', 'img_background_dreams_gallery'
                    ]
                }
            },
            where: [
                ['AND', 0, '_active', '=', 1],
                ['AND', 0, '_banned', '<>', 1]
            ],
            order: [
                ['0', 'users_key', 'desc']
            ],
            search: [
                {alias: 0, field: 'username',  param: types.search.like_full },
                {alias: 0, field: 'firstname',  param: types.search.like_full },
                {alias: 0, field: 'lastname',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },

        users    : {
            sources: {
                0: {
                    from: ['users', 'users'],
                    fields: [
                        'users_key', '_public', '_active', '_banned', '_pending_pwd',
                        '_creation_date', '_deactivation_date', 'username', 'password',
                        'email', 'facebook_id', 'instagram_id', 'twitter_id',
                        'firstname', 'lastname', 'gender', 'birthday',
                        'img_profile', 'img_background', 'img_background_dreams_gallery'
                    ]
                }
            },
            where: [
                ['AND', 0, 'users_key', types.where.check],
                ['AND', 0, '_active', '=', 1],
                ['AND', 0, '_banned', '<>', 1]
            ],
            order: [
                ['0', 'users_key', 'desc']
            ],
            search: [
                {alias: 0, field: 'username',  param: types.search.like_full },
                {alias: 0, field: 'firstname',  param: types.search.like_full },
                {alias: 0, field: 'lastname',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },

        profile  : {
            sources: {
                0: {
                    from: ['users', 'users'],
                    fields: [
                        'users_key', '_public', '_active', '_banned', '_pending_pwd',
                        '_creation_date', '_deactivation_date', 'username', 'password',
                        'email', 'facebook_id', 'instagram_id', 'twitter_id',
                        'firstname', 'lastname', 'gender', 'birthday',
                        'img_profile', 'img_background', 'img_background_dreams_gallery'
                    ]
                }
            },
            where: [
                ['AND', 0, '_token', types.where.get]
            ],
            order: [
                ['0', 'users_key', 'desc']
            ],
            search: [
                {alias: 0, field: 'username',  param: types.search.like_full },
                {alias: 0, field: 'firstname',  param: types.search.like_full },
                {alias: 0, field: 'lastname',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },

        follower : {
            sources: {
                0: {
                    from: ['users', 'users'],
                    fields: [
                        'users_key', '_public', // '_to_come_true', '_comming_true', '_came_true',
                        // '_me_too'
                        'username', 'firstname', 'img_profile'
                    ]
                }
            },
            where: [
                ['AND', 0, '_token', types.where.check],
                ['AND', 0, '_active', '=', 1],
                ['AND', 0, '_banned', '<>', 1]
            ],
            order: [
                ['0', 'users_key', 'desc']
            ],
            search: [
                {alias: 0, field: 'username',  param: types.search.like_full },
                {alias: 0, field: 'firstname',  param: types.search.like_full },
                {alias: 0, field: 'lastname',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },

        following: {
            sources: {
                0: {
                    from: ['users', 'users'],
                    fields: [
                        'users_key', '_public', // '_to_come_true', '_comming_true', '_came_true',
                        // '_me_too'
                        'username', 'firstname', 'img_profile'
                    ]
                }
            },
            where: [
                ['AND', 0, '_token', types.where.check],
                ['AND', 0, '_active', '=', 1],
                ['AND', 0, '_banned', '<>', 1]
            ],
            order: [
                ['0', 'users_key', 'desc']
            ],
            search: [
                {alias: 0, field: 'username',  param: types.search.like_full },
                {alias: 0, field: 'firstname',  param: types.search.like_full },
                {alias: 0, field: 'lastname',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },

        update   : {
            sources: {
                0: {
                    from: ['users', 'users'],
                    key: 'users_key',
                    where: [
                        
                    ]
                }
            },
            showSQL: 0
        }

    };

    //endregion


    //region :: Eventos Aplicados

    this.onSelect = function *(prov, ctx){
        if (prov['id'] == 'login') {

            if (this.params['facebook_id']){
                prov.where.push(['AND', 0, 'facebook_id', '=', "'" + this.params['facebook_id'] + "'"]);

            } else if (this.params['instagram_id']){
                prov.where.push(['AND', 0, 'instagram_id', '=', "'" + this.params['instagram_id'] + "'"]);

            } else if (this.params['twitter_id']){
                prov.where.push(['AND', 0, 'twitter_id', '=', "'" + this.params['twitter_id'] + "'"]);

            } else if (this.params['email']){
                prov.where.push(['AND', 0, 'email', '=', "'" + this.params['email'] + "'"]);
                prov.where.push(['AND', 0, 'password', '=', "'" + this.params['password'] + "'"]);

            } else if (this.params['username']){
                prov.where.push(['AND', 0, 'username', '=', "'" + this.params['username'] + "'"]);
                prov.where.push(['AND', 0, 'password', '=', "'" + this.params['password'] + "'"]);

            } else {
                prov.where.push(['AND', 0, "'1'", '=', "'2'"]);
            }

        }
    };

    /**
     * Evento chamado na operação POST :: Insert
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     */
    this.onInsert = function *(ret, ctx){
        var crypto = require('crypto')
            , hash = crypto.createHash('sha256')
            ;

        // Imagens
        this.params.img_background = this.params.row['img_background'];
        this.params.img_profile = this.params.row['img_profile'];

        this.params.row['img_background'] = this.params.row['img_profile'] = '';

        hash.update(this.params.row['username'] + this.params.row['password']);
        this.params.row['_token'] = hash.digest('hex');
    };

    /**
     * Evento chamado ao final da operação POST :: Insert
     * @param ret Objeto de retorno
     */
    this.onAfterInsert = function *(ret, ctx){
        ret['token'] = this.params.row['_token'];
        ret['success'] = this.params.row['_token'] ? 1 : 0;
        this.params['users_key'] = this.params.row['users_key'] = ret['result'];

        // Salva imagens
        var ok = yield this.saveUserImages();
        if (ok){
            yield this.update(ctx);
        }

        if (this.params.row['device']){
            var dev = this.engine.initObj(["users", "user_devices"], ctx);
            dev.params.row = {
                users_key: this.params['users_key'],
                token: this.params.row['device']
            };
            var ok = yield dev.insert();
        }

        var data = yield this.select(ctx, 'default', false, ['users', 'users']);
        ret['data'] = data;
    };

    /**
     * Evento chamado na operação PUT :: Update
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     */
    this.onUpdate = function *(ret, ctx){
        yield this.saveUserImages();
    };

    //endregion


    //region :: Eventos

    /**
     * Evento chamado no início de qualquer operação GET
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     *
    this.onGet = function *(ret, ctx){

    };

    /**
     * Evento chamado ao final de qualquer operação GET
     * @param ret Objeto de retorno
     *
    this.onAfterGet = function *(ret){

    };

    /**
     * Evento chamado na operação GET :: LIST
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     *
    this.onList = function *(ret, ctx){

    };

    /**
     * Evento chamado ao final da operação GET :: LIST
     * @param ret Objeto de retorno
     *
    this.onAfterList = function *(ret){

    };

    /**
     * Evento chamado na operação GET :: SEARCH
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     *
     this.onSearch = function *(ret, ctx){

    };

    /**
     * Evento chamado ao final da operação GET :: SEARCH
     * @param ret Objeto de retorno
     *
     this.onAfterSearch = function *(ret){

    };

    /**
     * Evento chamado para processamento customizado de
     * cada row em um select
     * @param row
     *
     this.onGetRow = function (row){
        row['teste'] = 'estive no get row!!!';
    };
     
    /**
     * Evento chamado na operação GET :: EDIT
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     *
     this.onEdit = function *(ret, ctx){

    };

    /**
     * Evento chamado ao final da operação GET :: EDIT
     * @param ret Objeto de retorno
     *
     this.onAfterEdit = function *(ret){

    };

     /**
     * Evento chamado na operação GET :: CREATE
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     *
     this.onCreate = function *(ret, ctx){

    };

     /**
     * Evento chamado ao final da operação GET :: CREATE
     * @param ret Objeto de retorno
     *
     this.onAfterCreate = function *(ret){

    };*/

    /**
     * Evento chamado ao final da operação PUT :: Update
     * @param ret Objeto de retorno
     *
    this.onAfterUpdate = function *(ret){

    };

    /**
     * Evento chamado na operação DELETE :: Delete
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     *
     this.onDelete = function *(ret, ctx){

    };

    /**
     * Evento chamado ao final da operação DELETE :: Delete
     * @param ret Objeto de retorno
     *
     this.onAfterDelete = function *(ret){

    };
     
     
     /* */

    //endregion


    //region :: Regras de Negócio

    /**
     * Troca de senha de usuário
     * @param ctx
     * @returns {*}
     */
    this.forgotpwd = function *(ctx){
        try {
            if (!this.params['email']) {
                return {
                    success: 0,
                    msg: 'Não foi informado o email para recuperação da senha'
                };
            }

            // Acha usuário com base no email
            var data = yield this.select(ctx, 'default', {
                where: [
                    ["AND", 0, "email", "=", "'" + this.params['email'] + "'"]
                ]
            }, ['users', 'users']);

            if (!data['rows'] || !data.rows.length){
                return {
                    success: 0,
                    msg: 'Email não encontrado'
                };
            }
            var
                user = data.rows[0]
                , user_key = user['user_key']
                , locale = user['_locale']
            ;

            var length = 8,
                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                pwd = ""
                ;
            for (var i = 0, n = charset.length; i < length; ++i) {
                pwd += charset.charAt(Math.floor(Math.random() * n));
            }

            // Altera senha
            this.params.row = {};
            this.params.row['users_key'] = user_key;
            this.params.row['password'] = pwd;
            yield this.update(ctx);

            // envia email
            try {
                var email = require("emailjs/email")
                    , jade = require("jade")
                ;
                var server = email.server.connect(
                    this.engine.app.context.config.email
                );

                server.send({
                    text: jade.renderFile('views/emails/pwd/' + locale + '.jade', {pwd: pwd}),
                    from: "Dreams <" + this.engine.app.context.config.email.dreams + ">",
                    to: user['firstname'] + (user['lastname'] ? user['lastname'] : '')
                    + " <" + user['email'] + ">",
                    subject: "Dreams - Recuperação de senhas"
                }, function (err, message) {
                    console.log(err || message);
                });

            } catch (e) {
                console.log(e.message);
            }

        } catch (e){
            console.log(e.message);
        }

        // Retorna user
        return ret;
    };

    /**
     * Salva imagens dos usuário recebidas em base64
     */
    this.saveUserImages = function *(){
        var ok = false
            , img_profile    = this.params['img_profile']    || this.params.row['img_profile']
            , img_background = this.params['img_background'] || this.params.row['img_background']
        ;

        // Imagem de profile
        if (img_profile && (img_profile.length > 1000) && this.params.row['users_key']){
            var img = this.engine.saveBase64Image(
                "web/imgs/users/p_" + this.params.row['users_key'],
                img_profile
            );
            this.params.row['img_profile'] = img.substr(4);
            ok = true;
        }

        // Imagem de profile
        if (img_background && (img_background.length > 1000) && this.params.row['users_key']){
            var img = this.engine.saveBase64Image(
                "web/imgs/users/b_" + this.params.row['users_key'],
                img_background
            );
            this.params.row['img_background'] = img.substr(4);
            ok = true;
        }

        return ok;
    };

    //endregion
    
}

// Types
const types = require('../../../types');

// Exporta
module.exports = Users;