import Joi from "joi";

export const validarFormatoCrearRegistroTutoria = (registroTutoria) => {
    const schema = Joi.object({
        periodoAcademico: Joi.string().required(),
        externalIdDocente: Joi.string().required(),
    })
    return schema.validate(registroTutoria);
}