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
        active: true,
        token: 'b778b0aad2ceda1b1577a77ba1f295e14fce706b33d17469cf477194f76a633a'
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
        'users'     : {mod: 'users/users',            provider: 'default'},
        'profile'   : {mod: 'users/users',            provider: 'profile'},
        'follow'    : {mod: 'users/user_follow',      provider: 'default'},
        'followers' : {mod: 'users/user_followers',   provider: 'default'},
        
        // Sonhos
        'mydreams'  : {mod: 'dreams/dreams',          provider: 'mydreams'},
        'dreamtoo'  : {mod: 'users/users_dreams_rel', provider: 'default'},
        
        'dreams'    : {mod: 'dreams/dreams',          provider: 'default'},
        'comingtrue': {mod: 'dreams/dreams',          provider: 'comingtrue'},
        'cametrue'  : {mod: 'dreams/dreams',          provider: 'cametrue'},
        'tocometrue': {mod: 'dreams/dreams',          provider: 'tocometrue'},
        'dreamers'  : {mod: 'users/users',            provider: 'dreamers'},
        
        'following' : {mod: 'users/user_following',   provider: 'default'},
    }

};