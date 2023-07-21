import Joi from "joi";

export const validarFormatoCrearTutoriaEstudiante = (tutoria) => {
    const schema = Joi.object({
        external_id_docente: Joi.string().required(),
        external_id_materia: Joi.string().required(),
    })

    return schema.validate(tutoria);

}

export const validarFormatoCrearTutoriaDocente = (tutoria) => {
    const schema = Joi.object({
        fecha: Joi.date().iso().required(),
        estado: Joi.string().valid('Espera','Aceptada','Realizada','Cancelada').required(),
        nombreTutoria: Joi.string().required(),
        descripcion: Joi.string().required(),
        duracion: Joi.date().required(),
    })

    return schema.validate(tutoria);
}