import Joi from "joi";

export const determinarTipoPersona = (req) => {

    const { docente, estudiante } = req.body;

    const personaData = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        identificacion: req.body.identificacion,
        direccion: req.body.direccion,
        cuenta: {
            create: {
                correo: req.body.correo,
                clave: req.body.clave,
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


export const validarFormatoRegistro =  (req) => {
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