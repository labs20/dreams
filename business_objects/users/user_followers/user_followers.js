/**
 * BusinessObject :: UserFollowers
 *  Implementação de objeto de negócio:
 *
 *  Usuários que seguem meu profile.
 *
 * Engine de aplicações - TShark.
 * @since Mon May 09 2016 18:08:05 GMT-0300 (BRT)
 * @constructor
 */
function UserFollower(){

    //region :: Definições do Objeto

    // Id
    this.id = 'user_followers';

    // Map
    this.source = {
        table: 'user_follower',
        metadata: {
            key: ['users_key', 'follower_key'],
            fields: {
                users_key: {
                    tipo: types.comp.dropdown, label: 'Usuário:',
                    data: {
                        key: ['users_key'],
                        from: ['users', 'users'],
                        template: '{row.users_key} - {row.username}',
                        provider: 'profile'
                    }
                }, 
                follower_key: {
                    tipo: types.comp.int, label: 'Seguido por:',
                    data: {
                        key: ['users_key'],
                        from: ['users', 'users'],
                        template: '{row.users_key} - {row.username}',
                        provider: ''
                    }
                },
                _accept: {
                    tipo: types.comp.check, label: 'Aceita Follower:'
                },
                _creation_date: {
                    tipo: types.comp.timestamp, label: 'Data Criação:'
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
                {titulo: "Follower de um Usuário"},
                {_accept: 20, follower_key: 80}
            ],
            ctrls: {
                
            }
        }

    };

    //endregion


    //region :: Providers

    this.providers = {

        default: {
            sources: {
                0: {
                    from: ['users', 'user_followers'],
                    fields: [
                        '_accept'
                    ]
                },
                1: { // Este user
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.inner, on: 'users_key', where: ''},
                    fields: [ ]
                },
                2: { // Followers
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.inner, on: ['users_key', 'follower_key'], where: ''},
                    fields: [
                        'users_key', '_public', // '_to_come_true', '_comming_true', '_came_true',
                        // '_me_too'
                        'username', 'firstname', 'img_profile'
                    ]
                }
            },
            where: [ 
                ['AND', 1, '_token', types.where.check],
                ['AND', 0, '_accept', '=', '1'],
                ['AND', 0, 'follower_key', types.where.check],
            ],
            order: [
                ['2', 'firstname', 'desc']
            ],
            search: [ 
                
            ],
            limit: 250,
            showSQL: 0
        },

        update: {
            sources: {
                0: {
                    from: ['users', 'user_followers'],
                    key: ['users_key', 'follower_key'],
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

    };
     
    /**
     * Evento chamado na operação POST :: Insert
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     */
    this.onInsert = function *(prov, ctx){

        // Pega o usuário pelo token
        var data = yield this.select(ctx, 'profile', false, ['users', 'users'])
            , users_key
            , _accept = 0
        ;

        if (data.rows.length) {
            users_key = data.rows[0]['users_key'];
        }

        // Verifica se o perfil do cara que ira me seguir é público
        data = yield this.select(ctx, 'default', {
            where: [
                ['AND', 0, 'users_key', '=', this.params.row['follower_key']]
            ]
        }, ['users', 'users']);

        if (data.rows.length) {
            _accept = data.rows[0]['_public'];
        }

        this.params.row['users_key'] = users_key;
        this.params.row['_accept'] = _accept;


    };

    /**
     * Evento chamado ao final da operação POST :: Insert
     * @param ret Objeto de retorno
     *
     this.onAfterInsert = function *(ret){

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
     */
     this.onDelete = function *(prov, ctx){
         prov.sources[0].key = 'follower_key';
         this.params.row['follower_key'] = this.params.row['users_key,follower_key'];
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
const types = require('../../../tshark/types');

// Exporta
module.exports = UserFollower;