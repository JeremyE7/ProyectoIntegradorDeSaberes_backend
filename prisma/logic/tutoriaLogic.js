import Joi from "joi";

export const validarFormatoCrearTutoriaEstudiante = (tutoria) => {
    const schema = Joi.object({
        external_id_docente: Joi.string().required(),
        external_id_materia: Joi.string().required(),
        descripcion: Joi.string().required(),
        nombreTutoria: Joi.string().required()
    })

    return schema.validate(tutoria);

}

export const validarFormatoCrearTutoriaDocente = (tutoria) => {
    const schema = Joi.object({
        fecha: Joi.date().iso().required(),
    })

    return schema.validate(tutoria);
}

export const validarCambiarEstadoTutoriaDocente = (tutoria) => {
    const schema = Joi.object({
        estado: Joi.string().valid('Realizada','Rechazada').required(),
        fechaFinalizacion: tutoria.estado === "Realizada" ? Joi.date().iso().required(): Joi.date().iso().optional(),
    })

    return schema.validate(tutoria);
}