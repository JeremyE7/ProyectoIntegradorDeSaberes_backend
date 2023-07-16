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
                        nombre: req.body.rol
                    }
                }
            }
        }
    };

    if (docente) {
        personaData.docente = {
            create: {
                codigo: docente.codigo,
                grado: docente.grado,
                materia: {
                    connect: {
                        nombre: docente.materia
                    }
                }
            }
        };
    }

    if (estudiante) {
        personaData.estudiante = {
            create: {
                codigo: estudiante.codigo,
                grado: estudiante.grado
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
        rol: Joi.string().required()
    })

    return schema.validate(req.body);;
}