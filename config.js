/**
 * BusinessObjects - Objetos suportados pela aplicação
 * 20/02/16
 */
module.exports = {
    info: {
        application: {
            title: 'Dreams App Server',
            desc: 'Server de aplicações Dreams'
        }
    },
    
    run:{
        port: 3000
    },
    
    security:{
        active: true 
    },

    // Conexão à repositório de dados
    conexao:{
        tipo: 'mysql',
        conn: {
            database: 'dreams',
            user: 'root',
            password: 'desenv123'
        }
    },

    // Mapa de APIs dinâmicas
    apiMap: {

        // Usuários
        'users'     : {mod: 'users/users',          provider: 'default'},
        'profile'   : {mod: 'users/users',          provider: 'profile'},
        'follower'  : {mod: 'users/user_follower',  provider: 'default'},
        'following' : {mod: 'users/user_following', provider: 'default'},

        // Sonhos
        'dreams'    : {mod: 'dreams/dreams',        provider: 'default'},
        'mydreams'  : {mod: 'dreams/dreams',        provider: 'mydreams'},
        'comingtrue': {mod: 'dreams/dreams',        provider: 'comingtrue'},
        'cametrue'  : {mod: 'dreams/dreams',        provider: 'cametrue'},
        'tocometrue': {mod: 'dreams/dreams',        provider: 'tocometrue'},
        'dreamers'  : {mod: 'users/users',          provider: 'dreamers'},
    }

};