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
                _token: {
                    tipo: types.comp.text, label: 'Token:'
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
                    tipo: types.comp.text, label: 'Imagem Profile:'
                },
                img_background: {
                    tipo: types.comp.text, label: 'Imagem Background:'
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
                {_token: 100},
            ],
            ctrls: {
                
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
                        '_creation_date', '_deactivation_date', '_token', 'username', 'password',
                        'email', 'facebook_id', 'instagram_id', 'twitter_id',
                        'firstname', 'lastname', 'gender', 'birthday',
                        'img_profile', 'img_background'
                    ]
                }
            },
            where: [ 
                ['AND', 0, 'users_key', types.where.check],
                //['AND', 0, '_active', '=', 1],
                //['AND', 0, '_banned', '<>', 1]
            ],
            order: [
                ['0', 'users_key', 'desc']
            ],
            search: [ 
                
            ],
            limit: 250,
            showSQL: 0
        },

        login  : {
            sources: {
                0: {
                    from: ['users', 'users'],
                    fields: [
                        'users_key', '_public', '_pending_pwd', '_token',
                        'username', 'password', 'email', 'facebook_id', 'instagram_id', 'twitter_id',
                        'firstname', 'lastname', 'gender', 'birthday',
                        'img_profile', 'img_background'
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

            ],
            limit: 250,
            showSQL: 0
        },

        users  : {
            sources: {
                0: {
                    from: ['users', 'users'],
                    fields: [
                        'users_key', '_public', '_active', '_banned', '_pending_pwd',
                        '_creation_date', '_deactivation_date', 'username', 'password',
                        'email', 'facebook_id', 'instagram_id', 'twitter_id',
                        'firstname', 'lastname', 'gender', 'birthday',
                        'img_profile', 'img_background'
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
                        'img_profile', 'img_background'
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

            ],
            limit: 250,
            showSQL: 0
        },




        update: {
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

     this.onSelect = function *(prov, ctx){
         if (prov['id'] == 'login') {

             if (this.params['facebook_id']){
                 prov.where.push(['AND', 0, 'facebook_id', '=', "'" + this.params['facebook_id'] + "'"]);

             } else if (this.params['instagram_id']){
                 prov.where.push(['AND', 0, 'instagram_id', '=', "'" + this.params['instagram_id'] + "'"]);

             } else if (this.params['twitter_id']){
                 prov.where.push(['AND', 0, 'twitter_id', '=', "'" + this.params['twitter_id'] + "'"]);

             } else if (this.params['username']){
                 var crypto = require('crypto')
                     , hash = crypto.createHash('sha256')
                 ;
                 hash.update(this.params['password']);

                 prov.where.push(['AND', 0, 'username', '=', "'" + this.params['username'] + "'"]);
                 prov.where.push(['AND', 0, 'password', '=', "'" + hash.digest('hex') + "'"]);


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

        hash.update(this.params.row['username'] + this.params.row['password']);
        this.params.row['_token'] = hash.digest('hex');
    };

    /**
     * Evento chamado ao final da operação POST :: Insert
     * @param ret Objeto de retorno
     */
    this.onAfterInsert = function *(ret){
        ret['token'] = this.params.row['_token'];
    };

    /**
     * Evento chamado na operação PUT :: Update
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     *
     this.onUpdate = function *(ret, ctx){

    };

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

    //endregion
    
}

// Types
const types = require('../../../types');

// Exporta
module.exports = Users;