/**
 * BusinessObject :: UsersDreamsRel
 *  Implementação de objeto de negócio: users_dreams_rel.
 *
 * Engine de aplicações - TShark.
 * @since Mon May 09 2016 14:40:50 GMT-0300 (BRT)
 * @constructor
 */
function UsersDreamsRel(){

    //region :: Definições do Objeto

    // Id
    this.id = 'users_dreams_rel';

    // Map
    this.source = {
        table: 'users_dreams_rel',
        metadata: {
            key: ['users_key', 'dreams_key'],
            fields: {
                users_key: {
                    tipo: types.comp.key, label: 'Users:',
                    data: { 
                        key: ['users_key'], 
                        from: ['default', 'users', 'users'], 
                        template: '{row.users_key} - {row.user}', 
                        provider: '' 
                    } 
                }, 
                dreams_key: {
                    tipo: types.comp.dropdown, label: 'Dreams:',
                    data: { 
                        key: ['dreams_key'], 
                        from: ['default', 'dreams', 'dreams'], 
                        template: '{row.dreams_key} - {row.description}',
                        provider: 'coletivos'
                    } 
                },
                _accept: {
                    tipo: types.comp.check, label: 'Aceita Participar:'
                },
                _creation_date: {
                    tipo: types.comp.datetime, label: ' Creation Date:'
                }, 
                _exclusion_date: {
                    tipo: types.comp.datetime, label: ' Exclusion Date:'
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
                {titulo: "Sonhos coletivos"},
                {_accept: 20, dreams_key: 80}
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
                    from: ['users', 'users_dreams_rel'],
                    fields: [
                        '_accept'
                    ]
                },
                1: {
                    from: ['dreams', 'dreams'],
                        join: {source: 0, tipo: types.join.left, on: 'dreams_key', where: ''},
                    fields: [
                        'dreams_key', 'users_key', 'owner_key',
                        '_creation_date',
                        // '_comments', '_likes', '_albuns', '_dreamers'
                        '_status', 'description', 'img_cover'


                        /*'_active', '_banned',
                         '_last_changed_date', '_exclusion_date', '_coming_true_date', '_came_true_date',
                         '_privacy'*/
                    ]
                },
                2: {
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.inner, on: 'users_key', where: ''},
                    fields: [

                    ]
                }
            },
            where: [ 
                ['AND', 2, '_token', types.where.check],
                ['AND', 0, 'users_key', types.where.check],
                ['AND', 0, 'dreams_key', types.where.check]
            ],
            order: [
                ['0', 'dreams_key', 'desc']
            ],
            search: [ 
                
            ],
            limit: 250,
            showSQL: 0
        },

        dreamer: {
            sources: {
                0: {
                    from: ['users', 'users_dreams_rel'],
                    fields: [
                        '_accept'
                    ]
                },
                1: {
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.inner, on: 'users_key', where: ''},
                    fields: [
                        '*'
                    ]
                }
            },
            where: [
                ['AND', 0, 'dreams_key', types.where.check]
            ],
            order: [
                ['0', 'dreams_key', 'desc']
            ],
            search: [

            ],
            limit: 250,
            showSQL: 0
        },

        update: {
            sources: {
                0: {
                    from: ['users', 'users_dreams_rel'],
                    key: ['users_key', 'dreams_key'],
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
         if (!this.params.row['users_key']) {
             var data = yield this.select(ctx, 'profile', false, ['users', 'users']);
             if (data.rows.length) {
                 this.params.row['users_key'] = data.rows[0]['users_key'];
             }
             this.params['push'] = 'participou';
         }
    };

    /**
     * Evento chamado ao final da operação POST :: Insert
     * @param ret Objeto de retorno
     */
    this.onAfterInsert = function *(ret, ctx){
        var msg = '' 
            , key = this.params.row['users_key'] 
            , dream = yield this.select(ctx, 'default', false, ['dreams', 'dreams'])
        ;
        
        if (this.params['push']) {
            var profile = yield this.select(ctx, 'profile', false, ['users', 'users']);
            msg = profile.rows[0]['firstname'] + (profile.rows[0]['lastname'] ? ' ' + profile.rows[0]['lastname'] : '');
            msg += " participou do seu sonho";
            
            key  = dream.rows[0]['users_key'];
            
        } else {
            var user = yield this.select(ctx, 'profile', false, ['users', 'users']);

            // Mensagem
            msg = user.rows[0]['firstname'] + (user.rows[0]['lastname'] ? ' ' + user.rows[0]['lastname'] : '');
            switch (dream.rows[0]['_status']){
                case 1:
                    msg += " quer realizar";
                    break;

                case 2:
                    msg += " está realizando";
                    break;

                case 3:
                    msg += " realizou";
                    break;
            }
            msg += " um sonho com você";
        }
        
        // Push
        yield this.engine.sendPush(ctx, {
            to_users: [key],
            expire: 1,
            android: {
                data: {
                    message: msg
                }
            },
            ios: {
                alert: msg
            }
        });
    };

    /**
     * Evento chamado na operação PUT :: Update
     * @param ret Objeto de retorno
     * @param ctx Contexto de chamada
     */
    this.onUpdate = function *(ret, ctx){
         var data = yield this.select(ctx, 'profile', false, ['users', 'users']);
         if (data.rows.length) {
             this.params.row['users_key'] = data.rows[0]['users_key'];
         }
    };

    /**
     * Evento chamado ao final da operação PUT :: Update
     * @param ret Objeto de retorno
     */
    this.onAfterUpdate = function *(ret, ctx){
        if (this.params.row['_accept']){
            var profile = yield this.select(ctx, 'profile', false, ['users', 'users'])
                , dream = yield this.select(ctx, 'default', false, ['dreams', 'dreams'])
            ;

            // Mensagem
            var msg = profile.rows[0]['firstname'] + (profile.rows[0]['lastname'] ? ' ' + profile.rows[0]['lastname'] : '');
            msg += " aceitou ser adicionado em seu sonho";

            // Push
            yield this.engine.sendPush(ctx, {
                to_users: [dream.rows[0]['users_key']],
                expire: 1,
                android: {
                    data: {
                        message: msg
                    }
                },
                ios: {
                    alert: msg
                }
            });
        }
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
module.exports = UsersDreamsRel;