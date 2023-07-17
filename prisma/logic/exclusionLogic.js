import _ from "lodash"
/**
 * Metodo para excluir campos de una lista de objetos
 * @param {Lista de objetos} res 
 * @param {Campos a excluir} campos 
 * @returns Respuesta con los campos excluidos
 */
export const excluirCampos = (res, campos)=>{
    for(const dato of res){
        res = _.omit(dato, campos)
    }
    return res    
}