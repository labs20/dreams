/*
 * Menu da aplicação
 */
module.exports = {
    rows: [

        // Menu de Usuários
        {
            label: "Dreamers",
            area: "app-dreamers",
            icon: "users icon",
            submenu: [
                {
                    label: "Visualizar"
                },
                {
                    label: "Banidos"
                },
                {
                    label: "???"
                }
            ]
        },

        // Menu de Sonhos
        {
            label: "Dreams",
            area: "app-dreams",
            icon: "cloud icon",
            submenu: [
                {
                    label: "Visualizar"
                },
                {
                    label: "Sugeridos"
                },
                {
                    label: "???"
                }
            ]
        },


        // Menu de Sistema
        {
            label: "Sistema",
            area: "app-sistema",
            icon: "options icon",
            submenu: [
                {
                    label: "APIs",
                },
                {
                    label: "Configurações"
                },
                {
                    label: "Acesso"
                },
                {
                    label: "Sair do Sistema",
                    api: "sys app security logout"
                }
            ]
        }
    ]
};