/**
 * BusinessObject :: CommentsDreamsRel
 *  Implementação de objeto de negócio: comments_dreams_rel.
 *
 * Engine de aplicações - TShark.
 * @since Mon May 09 2016 14:41:17 GMT-0300 (BRT)
 * @constructor
 */
function CommentsDreamsRel(){

    //region :: Definições do Objeto

    // Id
    this.id = 'comments_dreams_rel';

    // Map
    this.source = {
        table: 'comments_dreams_rel',
        metadata: {
            key: ['comments_key', 'dreams_key'],
            fields: {
                comments_key: {
                    tipo: types.comp.key, label: 'Comments:',
                    data: { 
                        key: ['comments_key'], 
                        from: ['comments', 'comments'],
                        template: '{row.comments_key} - {row.comment}', 
                        provider: '' 
                    } 
                }, 
                dreams_key: {
                    tipo: types.comp.dropdown, label: 'Dreams:',
                    data: { 
                        key: ['dreams_key'], 
                        from: ['dreams', 'dreams'],
                        template: '{row.dreams_key} - {row.description}',
                        provider: '' 
                    } 
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
                {titulo: "Comentário de sonho"},
                {comments_key: 25, dreams_key: 75},
                {comment: 100}
            ],
            ctrls: {
                comment: {
                    tipo: types.comp.text_big, label: "Comentário:"
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
                    from: ['comments', 'comments_dreams_rel'],
                    fields: [
                    ]
                },
                1: { 
                    from: ['comments', 'comments'],
                        join: {source: 0, tipo: types.join.left, on: 'comments_key', where: ''},
                    fields: [
                        'comments_key', 'users_key', '_creation_date', 'comment'
                    ]
                }
            },
            where: [ 
                ['AND', 0, 'comments_key', types.where.check],
                ['AND', 0, 'dreams_key', types.where.check]
            ],
            order: [
                ['0', 'comments_key', 'desc']
            ],
            search: [ 
                
            ],
            limit: 250,
            showSQL: 0
        },

        update: {
            sources: {
                0: {
                    from: ['comments', 'comments_dreams_rel'],
                    key: ['comments_key', 'dreams_key'],
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

        var c   = this.engine.initObj(['comments', 'comments'], ctx)
            , r = yield c.insert(ctx)
        ;

        this.params.row['comments_key'] = r['result'];

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
module.exports = CommentsDreamsRel;