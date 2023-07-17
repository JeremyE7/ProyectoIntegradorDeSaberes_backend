import _ from "lodash"

export const excluirID = (res, campos)=>{
    for(const dato of res){
        for(const campo of campos){
            _.unset(dato,campo)
        }
    }
    return res    
}