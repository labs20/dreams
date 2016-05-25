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
    
    // Server push
    pushserver: {
        url:  "localhost",
        port: "8000",
        ios: {
            cert: "cert/dev/cert.pem",
            key: "cert/dev/key.pem",
            pass: "Dr3@m$#T3@m",
        }
    },

    email: {
        user:     "labs@softlabs.com.br",
        password: "Milreae89",
        host:     "mail.softlabs.com.br",
        dreams:   "contato@dreamsteam.com.br",
        ssl:      false
    },

    // Mapa de APIs dinâmicas
    apiMap: {

        // Login
        'login'         : {mod: 'users/users',                  provider: 'login'},
        'forgotpwd'     : {mod: 'users/users',                  exec: 'forgotPwd'},

        // Usuários
        'users'         : {mod: 'users/users',                  provider: 'default'},
        'profile'       : {mod: 'users/users',                  provider: 'profile'},
        'follow'        : {mod: 'users/user_follow',            provider: 'default'},
        'followall'     : {mod: 'users/user_follow',            provider: 'default'},
        'followers'     : {mod: 'users/user_followers',         provider: 'default'},
        
        // Sonhos
        'dreams'        : {mod: 'dreams/dreams',                provider: 'default'},
        'mydreams'      : {mod: 'dreams/dreams',                provider: 'mydreams'},
        'feedall'       : {mod: 'dreams/dreams',                provider: 'feedall'},
        'feedfollowing' : {mod: 'dreams/dreams',                provider: 'feedfollowing'},
        'dreamtoo'      : {mod: 'users/users_dreams_rel',       provider: 'default'},
        'tocometrue'    : {mod: 'dreams/dreams',                provider: 'tocometrue'},
        'comingtrue'    : {mod: 'dreams/dreams',                provider: 'comingtrue'},
        'cametrue'      : {mod: 'dreams/dreams',                provider: 'cametrue'},
        
        'albuns'        : {mod: 'dreams/dream_albuns',          provider: 'default'},
        'albumcomments' : {mod: 'comments/comments_albuns_rel', provider: 'default'},
        'albumlikes'    : {mod: 'users/users_like_albuns_rel',  provider: 'default'},

        'dreamcomments' : {mod: 'comments/comments_dreams_rel', provider: 'default'},
        'dreamlikes'    : {mod: 'users/users_like_dreams_rel',  provider: 'default'},


        'denuncy'       : {mod: 'denuncy/denuncy',              provider: 'default'},
        'dreamdenuncy'  : {mod: 'denuncy/denuncy_dreams_rel',   provider: 'default'},
        'albumdenuncy'  : {mod: 'denuncy/denuncy_albuns_rel',   provider: 'default'}

    }

};