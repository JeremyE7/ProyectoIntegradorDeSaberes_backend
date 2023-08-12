import Joi from "joi";
import bcrypt from "bcrypt";
/**
 * Metodo para comprobar comprobar si la persona sera de tipo estudiante, docente, o ninguno de los dos y 
 * @param {*} req Cuerpo de la peticion
 * @returns el objeto persona con los datos de la persona y los datos de estudiante o docente en caso de que se haya enviado
 */
export const determinarTipoPersona = async (req) => {

    const { docente, estudiante } = req.body;
    const claveHashed = await bcrypt.hash(req.body.clave, 10)
    console.log(req.file);
    const personaData = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        identificacion: req.body.identificacion,
        direccion: req.body.direccion,
        cuenta: {
            create: {
                correo: req.body.correo,
                clave: claveHashed,
                rol: {
                    connect: {
                        id: req.body.rol
                    }
                }
            }
        }
    };

    if (docente) {
        personaData.docente = {
            create: {
                titulo: docente.titulo,
            }
        };
    }

    if (estudiante) {
        personaData.estudiante = {
            create: {
                ciclo: estudiante.ciclo,
                paralelo: estudiante.paralelo,
                carrera: estudiante.carrera,
            }
        };
    }

    return personaData;
}

/**
 * Metodo para validar el formato de la peticion de tipo crearPersona
 * @param {*} req Cuerpo de la peticion de tipo crearPersona
 * @returns error si el formato es incorrecto
 */
export const validarFormatoRegistro = (req) => {
    const schema = Joi.object({
        nombre: Joi.string().required(),
        apellido: Joi.string().required(),
        identificacion: Joi.string().required(),
        correo: Joi.string().email().required(),
        direccion: Joi.string().required(),
        telefono: Joi.string().required(),
        clave: Joi.string().required(),
        rol: Joi.number().integer().required(),
        docente: Joi.object({
            titulo: Joi.string().required(),
        }).optional(),
        estudiante: Joi.object({
            ciclo: Joi.string().required(),
            paralelo: Joi.string().required(),
            carrera: Joi.string().required(),
        }).optional()
    })

    return schema.validate(req.body);;
}

export const validarFormatoEdicion = (req, cuenta) => {
    const schema = Joi.object({
        correo: Joi.string().email().optional(),
        clave: Joi.string().optional(),
        rol: Joi.string().optional(),
        persona: Joi.object({
            nombre: Joi.string().optional(),
            apellido: Joi.string().optional(),
            telefono: Joi.string().optional(),
            direccion: Joi.string().optional(),
            identificacion: Joi.string().optional(),
            docente: Joi.object({
                titulo: Joi.string().optional(),
            }).optional(),
            estudiante: Joi.object({
                ciclo: Joi.string().optional(),
                paralelo: Joi.string().optional(),
                carrera: Joi.string().optional(),
            }).optional()
        }).optional().options({ abortEarly: false })
    }).custom((value, helpers) => {
        if (value.persona && value.persona.docente && value.persona.estudiante) {
            return helpers.error('any.invalid');
        }
        return value;
    });

    return schema.validate(req.body);
};

export const determinarEdicionDocenteEstudiante = (cuenta, req) => {
    if (cuenta.persona.docente && req.body.persona.docente)
        return {
            nombre: req.body.persona.nombre,
            apellido: req.body.persona.apellido,
            telefono: req.body.persona.telefono,
            identificacion: req.body.persona.identificacion,
            direccion: req.body.persona.direccion,
            docente: {
                update: {
                    titulo: req.body.persona.docente.titulo
                }
            }
        }
    else if(cuenta.persona.estudiante && req.body.persona.estudiante){
        return {
            nombre: req.body.persona.nombre,
            apellido: req.body.persona.apellido,
            telefono: req.body.persona.telefono,
            identificacion: req.body.persona.identificacion,
            direccion: req.body.persona.direccion,
            estudiante:{
                update:{
                    ciclo: req.body.persona.estudiante.ciclo,
                    paralelo: req.body.persona.estudiante.paralelo,
                    carrera: req.body.persona.estudiante.carrera,
                }
            }
        } 
    }
    else{
        return {
            nombre: req.body.persona.nombre,
            apellido: req.body.persona.apellido,
            telefono: req.body.persona.telefono,
            identificacion: req.body.persona.identificacion,
            direccion: req.body.persona.direccion,
        }
    }
}




