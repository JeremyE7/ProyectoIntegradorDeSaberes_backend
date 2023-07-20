import Joi from "joi";

export const validarFormatoCrearMateria = (materia) => {
    const schema = Joi.object({
        nombre: Joi.string().required(),
        external_id_docente: Joi.string().required(),
    })

    return schema.validate(materia);

}