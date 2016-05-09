/**
 * Created by labs on 11/04/16.
 */
function Filiais(){

    this.teste = 123;

    this.onList = function *(ret) {
        return new Promise(function (resolve, reject) {
            ret['estive_no_onlist_overwrite'] = 'UUUUUUUhhh! ÊêÊêêêê!!';
            resolve(ret);
        });
    };

    this.onGetRow = function *(row){
        row['bplname'] += 'estisssssve no get row!!!';
    };

}

// Types
const types = require(module.paths[0] + '/tshark/types');

// Exporta
module.exports = Filiais;