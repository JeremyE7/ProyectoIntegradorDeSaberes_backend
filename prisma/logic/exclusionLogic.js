import _ from "lodash"
/**
 * Metodo para excluir campos de una lista de objetos
 * @param {Lista de objetos} res 
 * @param {Campos a excluir} campos 
 * @returns Respuesta con los campos excluidos
 */
export const excluirCampos = (res, campos)=>{
    return (Array.isArray(res)) ? res.map(dato => _.omit(dato, campos)) : _.omit(res, campos)
}