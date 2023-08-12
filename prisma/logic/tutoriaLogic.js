import Joi from "joi";

export const validarFormatoCrearTutoriaEstudiante = (tutoria) => {
    const schema = Joi.object({
        external_id_docente: Joi.string().required(),
        external_id_materia: Joi.string().required(),
        descripcion: Joi.string().required(),
        nombreTutoria: Joi.string().required(),
        tipoReunionTutoria: Joi.string().valid('Presencial','Virtual').required(),
    })

    return schema.validate(tutoria);

}

export const validarFormatoCrearTutoriaDocente = (tutoria) => {
    const schema = Joi.object({
        fecha: Joi.date().iso().required(),
        justificacion: Joi.string().optional(),
    })

    return schema.validate(tutoria);
}

export const validarCambiarEstadoTutoriaDocente = (tutoria) => {
    const schema = Joi.object({
        estado: Joi.string().valid('Realizada','Rechazada').required(),
        fechaFinalizacion: tutoria.estado === "Realizada" ? Joi.date().iso().required(): Joi.date().iso().optional(),
        justificacion: tutoria.estado === "Rechazada" ? Joi.string().required(): Joi.string().optional(),
    })

    return schema.validate(tutoria);
}