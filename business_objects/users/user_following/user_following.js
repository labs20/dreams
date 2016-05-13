/**
 * BusinessObject :: UserFollowing
 *  Implementação de objeto de negócio: user_following.
 *
 * Engine de aplicações - TShark.
 * @since Mon May 09 2016 18:08:05 GMT-0300 (BRT)
 * @constructor
 */
function UserFollowing(){

    //region :: Definições do Objeto

    // Id
    this.id = 'user_following';

    // Map
    this.source = {
        table: 'user_follower',
        metadata: {
            key: ['users_key', 'follower_key'],
            fields: {
                follower_key: {
                    tipo: types.comp.key, label: 'Usuário:',
                    data: {
                        key: ['users_key'],
                        from: ['users', 'users'],
                        template: '{row.users_key} - {row.username}',
                        provider: 'profile'
                    }
                },
                users_key: {
                    tipo: types.comp.dropdown, label: 'Seguindo:',
                    data: {
                        key: ['users_key'],
                        from: ['users', 'users'],
                        template: '{row.users_key} - {row.username}',
                        provider: ''
                    }
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
                {titulo: "Usuário seguindo:"},
                {follower_key: 50, users_key: 50}
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
                    from: ['users', 'user_follower'],
                    fields: [

                    ]
                },
                1: { // Este user
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.inner, on: ['users_key', 'follower_key'], where: ''},
                    fields: [ ]
                },
                2: { // Followers
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.inner, on: 'users_key', where: ''},
                    fields: [
                        'users_key', '_public', // '_to_come_true', '_comming_true', '_came_true',
                        // '_me_too'
                        'username', 'firstname', 'img_profile'
                    ]
                }
            },
            where: [
                ['AND', 1, '_token', types.where.check],
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
                    from: ['users', 'user_follower'],
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
    this.onInsert = function *(ret, ctx){
        var data = yield this.select(ctx, 'profile', {'_token': this.params['_token']}, ['users', 'users']);
        if (data.rows.length) {
            this.params.row['follower_key'] = data.rows[0]['users_key'];
        }
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
const types = require('../../../tshark/types');

// Exporta
module.exports = UserFollowing;