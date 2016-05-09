/**
 * Configurações globais do aplicativo - Nível APP.
 *  As configurações deste arquivo estarão disponíveis em todos
 *  os clientes deste aplicativo.
 *
 *  Todos os parâmetros definidos aqui poderão ser sobreescritos
 *  nos CLIENT, exceto o que estiver em:
 *   specific:{
 *       app:{
 *           // VALORES AQUI NÃO PODERÃO SER SOBREESCRITOS NOS NIVEIS ABAIXO
 *       }
 *   }
 *
 * @engine TShark 3.0
 * @copyright [== © 2016, Softlabs ==]
 * @link www.softlabs.com.br
 * @author Luiz Antonio B. Silva [Labs]
 * @since 09/04/2016
 */
module.exports = {

    // Valores protegidos específicos do nível
    specific: {
        app: {
            
        }
    },

    // Segurança nivel aplicativo - afeta todos os clients
    security: {
        active: true,
        mode: 'softlabs.security'
    },

    // Auditoria nivel aplicativo
    auditing: {

        // Desligado por padrão
        active: false,

        // Audita sempre quem tá aqui
        white_list: {

        },

        // Nunca audita quem está aqui
        black_list: {
            
        }
    }
};