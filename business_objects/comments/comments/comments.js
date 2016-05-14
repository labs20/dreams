/**
 * BusinessObject :: Comments
 *  Implementação de objeto de negócio: comments.
 *
 * Engine de aplicações - TShark.
 * @since Mon May 09 2016 14:41:17 GMT-0300 (BRT)
 * @constructor
 */
function Comments(){

    //region :: Definições do Objeto

    // Id
    this.id = 'comments';

    // Map
    this.source = {
        table: 'comments',
        metadata: {
            key: 'comments_key',
            fields: {
                comments_key: {
                    tipo: types.comp.key, label: 'Comments:'
                }, 
                users_key: {
                    tipo: types.comp.dropdown, label: 'Users:',
                    data: { 
                        key: ['users_key'], 
                        from: ['default', 'users', 'users'], 
                        template: '{row.users_key} - {row.user}', 
                        provider: '' 
                    } 
                }, 
                _active: {
                    tipo: types.comp.int, label: ' Active:'
                }, 
                _banned: {
                    tipo: types.comp.int, label: ' Banned:'
                }, 
                _creation_date: {
                    tipo: types.comp.datetime, label: ' Creation Date:'
                }, 
                _exclusion_date: {
                    tipo: types.comp.datetime, label: ' Exclusion Date:'
                }, 
                comment: {
                    tipo: types.comp.text_big, label: 'Comment:'
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
                {titulo: "Informações de comments"},
                {comments_key: 25, users_key: 25, _active: 25, _banned: 25}, 
                {_creation_date: 25, _exclusion_date: 25, comment: 50}
            ],
            ctrls: {
                comment: {
                    extra_right: { class: '', tag: '' },
                    extra_left:  { class: '', tag: '' }
                }
            }
        }

    };

    //endregion


    //region :: Providers

    this.providers = {

        default: {
            sources: {
                0: {
                    from: ['comments', 'comments'],
                    fields: [
                        'comment'
                    ]
                },
                1: { 
                    from: ['default', 'users', 'users'],
                        join: {source: 0, tipo: types.join.left, on: 'users_key', where: ''},
                    fields: [
                        
                    ]
                } 
            },
            where: [ 
                ['AND', 0, 'comments_key', types.where.check]
            ],
            order: [
                [0, 'comment', 'asc']
            ],
            search: [ 
                {alias: 0, field: 'comment',  param: types.search.like_full }
            ],
            limit: 250,
            showSQL: 0
        },

        update: {
            sources: {
                0: {
                    from: ['comments', 'comments'],
                    key: 'comments_key',
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

         // Pega o usuário pelo token
         var data = yield this.select(ctx, 'profile', false, ['users', 'users']);
         if (data.rows.length) {
             this.params.row['users_key'] = data.rows[0]['users_key'];
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
const types = require('../../../types');

// Exporta
module.exports = Comments;