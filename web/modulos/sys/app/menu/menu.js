/**
 * TShark - Client 3.0
 * Funcionalidades de interface: Menus da aplicação
 *
 * @copyright [== © 2016, Softlabs ==]
 * @link www.softlabs.com.br
 * @author Luiz Antonio B. Silva [Labs]
 * @since 04/03/2016
 */
tshark.modulos._add('sys.app.menu', {

    /**
     * Inicializa o menu
     */
    init: function(){

        // Carga de dados
        this.data.load(function(){

            // Efetua o bind do menu
            tshark.initIntf('.app-menu-popup');
            
        });

        // Armazena a última área aberta / inicializa com home
        this.old_area = 'app-home';
    },

    /**
     * Clique do menu
     */
    click: function(){

        // Esconde o menu
        $('.app-menu-trigger').popup('hide');

        // Esconde a área atual
        $("." + sys.app.menu.old_area).transition('hide');

        // Nova área
        sys.app.menu.old_area = $(this).data('area');

        var row = sys.app.menu.data.getRowAt($(this).data('menu-index'))
            ndx = $(this).data('submenu-index')
        ;

        app.bar.icon = 'circular large ' + row.icon;
        app.bar.area = row.label;
        row.submenu.forEach(s => {
            if (s._index_ == ndx){
                app.bar.secao = s.label;
                app.bar.submenu = s['submenu'];
            }
        });


        // Exibe a nova área
        $("." + sys.app.menu.old_area).transition('show');

    }

});


//# sourceURL=app.menu.js