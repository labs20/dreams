/**
 * BusinessObject :: Dreams
 *  Implementação de objeto de negócio: dreams.
 *
 * Engine de aplicações - TShark.
 * @since Mon May 09 2016 14:41:08 GMT-0300 (BRT)
 * @constructor
 */
function Dreams(){

    //region :: Definições do Objeto

    // Id
    this.id = 'dreams';

    // Map
    this.source = {
        table: 'dreams',
        metadata: {
            key: 'dreams_key',
            fields: {
                dreams_key: {
                    tipo: types.comp.key, label: 'Dreams:'
                }, 
                users_key: {
                    tipo: types.comp.dropdown, label: 'Users:',
                    data: { 
                        key: ['users_key'], 
                        from: ['users', 'users'],
                        template: '{row.users_key} - {row.username}',
                        provider: '' 
                    } 
                }, 
                owner_key: {
                    tipo: types.comp.dropdown, label: 'Owner:',
                    data: { 
                        key: ['owner_key'], 
                        from: ['users', 'users'],
                        template: '{row.owner_key} - {row.username}',
                        provider: '' 
                    } 
                }, 
                _privacy: {
                    tipo: types.comp.dropdown, label: ' Privacy:',
                    data: {
                        key: ['_privacy'],
                        template: '{row._privacy} - {row.label}',
                        rows: [
                            {_privacy: 'P', label: 'Publico'},
                            {_privacy: 'S', label: 'Secreto'},
                            {_privacy: 'F', label: 'Seguidores'},
                            {_privacy: 'C', label: 'Coletivo'}
                        ]
                    }
                }, 
                _status: {
                    tipo: types.comp.dropdown, label: ' Status:',
                    data: {
                        key: ['_status'],
                        template: '{row._status} - {row.label}',
                        rows: [
                            {_status: '1', label: 'To Come true'},
                            {_status: '2', label: 'Coming True'},
                            {_status: '3', label: 'Came True'}
                        ]
                    }
                }, 
                _active: {
                    tipo: types.comp.check, label: ' Active:'
                }, 
                _banned: {
                    tipo: types.comp.check, label: ' Banned:'
                }, 
                _creation_date: {
                    tipo: types.comp.datetime, label: ' Creation Date:'
                }, 
                _last_changed_date: {
                    tipo: types.comp.datetime, label: ' Last Changed Date:'
                }, 
                _exclusion_date: {
                    tipo: types.comp.datetime, label: ' Exclusion Date:'
                }, 
                _coming_true_date: {
                    tipo: types.comp.date, label: ' Coming True Date:'
                }, 
                _came_true_date: {
                    tipo: types.comp.date, label: ' Came True Date:'
                },
                _to_come_true_date: {
                    tipo: types.comp.date, label: ' To Come True Date:'
                },
                description: {
                    tipo: types.comp.text, label: 'Description:'
                }, 
                img_cover: {
                    tipo: types.comp.text, label: 'Img Cover:'
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
                {titulo: "Informações de dreams"},
                {dreams_key: 10, users_key: 25, owner_key: 25, _privacy: 10, _active: 10, _banned: 10, _status: 10},
                {description: 30, _to_come_true_date: 20, img_cover: 50},
                {_creation_date: 20, _last_changed_date: 20, _exclusion_date: 20, _coming_true_date: 20, _came_true_date: 20}
            ],
            ctrls: {
                
            }
        }

    };

    //endregion


    //region :: Providers

    /**
     * Fields default
     * @type {string[]}
     */
    this.def_fields = [
        'dreams_key', 'users_key', 'owner_key',
        '_creation_date',
        // '_comments', '_likes', '_albuns', '_dreamers'
        '_status', 'description', 'img_cover'


        /*'_active', '_banned',
         '_last_changed_date', '_exclusion_date', '_coming_true_date', '_came_true_date',
         '_privacy'*/
    ];

    /**
     * Provedores de dados
     */
    this.providers = {

        // Padrão
        default: {
            sources: {
                0: {
                    from: ['dreams', 'dreams'],
                    fields: this.def_fields
                },
                1: { 
                    from: ['users', 'users'],
                        join: {source: 0, tipo: types.join.left, on: 'users_key', where: ''},
                    fields: [
                        
                    ]
                },
                /*2: {
                    from: ['users', 'users'],
                        join: {source: 0, tipo: types.join.left, on: 'owner_key', where: ''},
                    fields: [
                        
                    ]
                } */
            },
            where: [ 
                ['AND', 0, 'dreams_key', types.where.check]
            ],
            order: [
                ['0', 'dreams_key', 'desc']
            ],
            search: [
                {alias: 0, field: 'description',  param: types.search.like_full }
            ],
            limit: 250,
            showSQL: 0
        },

        // Sonhos coletivos
        coletivos: {
            sources: {
                0: {
                    from: ['dreams', 'dreams'],
                    fields: this.def_fields
                }
            },
            where: [
                ['AND', 0, 'dreams_key', types.where.check],
                ['AND', 0, '_privacy', '=', "'C'"]
            ],
            order: [
                ['0', 'dreams_key', 'asc']
            ],
            search: [
                {alias: 0, field: 'description',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },

        // Sonhos do token
        mydreams: {
            sources: {
                0: {
                    from: ['dreams', 'dreams'],
                    fields: this.def_fields
                },
                1: {
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.left, on: 'users_key', where: ''},
                    fields: [

                    ]
                }
            },
            where: [
                ['AND', 1, '_token', types.where.get],
                ['AND', 0, 'dreams_key', types.where.check]
            ],
            order: [
                ['0', 'dreams_key', 'asc']
            ],
            search: [
                {alias: 0, field: 'description',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },

        // Sonhos do token - Com data para realizar
        tocometrue: {
            sources: {
                0: {
                    from: ['dreams', 'dreams'],
                    fields: this.def_fields
                },
                1: {
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.left, on: 'users_key', where: ''},
                    fields: [

                    ]
                }
            },
            where: [
                ['AND', 1, '_token', types.where.get],
                ['AND', 0, 'dreams_key', types.where.check],
                ['AND', 0, '_status', '=', '1']
            ],
            order: [
                ['0', 'dreams_key', 'asc']
            ],
            search: [
                {alias: 0, field: 'description',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },

        // Sonhos do token - Com data de realizando
        comingtrue: {
            sources: {
                0: {
                    from: ['dreams', 'dreams'],
                    fields: this.def_fields
                },
                1: {
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.left, on: 'users_key', where: ''},
                    fields: [

                    ]
                }
            },
            where: [
                ['AND', 1, '_token', types.where.get],
                ['AND', 0, 'dreams_key', types.where.check],
                ['AND', 0, '_status', '=', '2']
            ],
            order: [
                ['0', 'dreams_key', 'asc']
            ],
            search: [
                {alias: 0, field: 'description',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },

        // Sonhos do token - Realizados
        cametrue: {
            sources: {
                0: {
                    from: ['dreams', 'dreams'],
                    fields: this.def_fields
                },
                1: {
                    from: ['users', 'users'],
                    join: {source: 0, tipo: types.join.left, on: 'users_key', where: ''},
                    fields: [

                    ]
                }
            },
            where: [
                ['AND', 1, '_token', types.where.get],
                ['AND', 0, 'dreams_key', types.where.check],
                ['AND', 0, '_status', '=', '3']
            ],
            order: [
                ['0', 'dreams_key', 'asc']
            ],
            search: [
                {alias: 0, field: 'description',  param: types.search.like_full }

            ],
            limit: 250,
            showSQL: 0
        },


        // Update global
        update: {
            sources: {
                0: {
                    from: ['dreams', 'dreams'],
                    key: 'dreams_key',
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
     */
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
module.exports = Dreams;