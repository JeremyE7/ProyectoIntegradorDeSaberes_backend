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
    console.log(tutoria.observacionDocente);
    const schema = Joi.object({
        estado: Joi.string().valid('Semirealizada','Rechazada', 'Realizada').required(),
        fechaFinalizacion: tutoria.estado === "Semirealizada" ? Joi.date().iso().required(): Joi.date().iso().optional(),
        justificacion: tutoria.estado === "Rechazada" ? Joi.string().required(): Joi.string().optional(),
        observacionDocente: Joi.string().optional(),
        valoracion: tutoria.estado === "Realizada" ? Joi.number().min(1).max(5).required(): Joi.number().min(1).max(5).optional(),
        observacionEstudiante: Joi.string().optional(),
    })

    return schema.validate(tutoria);
}