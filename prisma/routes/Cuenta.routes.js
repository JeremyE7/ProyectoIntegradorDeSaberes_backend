/**
 * Jeremy
 */

import { Router } from "express";
import { prisma } from "../db.js";
import { determinarTipoPersona, validarFormatoRegistro, validarFormatoEdicion, determinarEdicionDocenteEstudiante } from "../logic/cuentaLogic.js";
import { excluirCampos } from "../logic/exclusionLogic.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validarToken } from "../middlewares/tokenLogic.js";
import { verificarCedulaUnica } from "../middlewares/verificarCedulaUnica.js";
import { verificarCorreoUnico } from "../middlewares/verificarCorreoUnico.js";
import multer from 'multer';
const router = Router();

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dhsupplvv',
    api_key: '925736886959598',
    api_secret: 'S4mmgHscsQ18z-a5MOCznHxGFbo'
});

const storage = multer.diskStorage({
    destination: 'uploads/firmas/', // Carpeta de destino para las imágenes de firma
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

//Ruta para registrar una nueva cuenta
router.post('/cuenta/registrar', verificarCedulaUnica, verificarCorreoUnico, async (req, res) => {

    //Verificar que no se intente crear una cuenta de tipo docente y estudiante a la vez
    const { docente, estudiante } = req.body;
    if (docente && estudiante) return res.status(400).json({ msj: "Error en la solicitud", error: 'Cuenta no puede ser de docente y estudiante al mismo tiempo' })

    // Valida los campos del cuerpo de la solicitud
    const { error } = validarFormatoRegistro(req);

    if (error) {
        // Si hay un error de validación, se responde con un mensaje de error
        return res.status(400).json({ msj: "Hace falta un campo en la peticion", error: error.details[0].message });
    }

    //Determinar el tipo de persona a registrar y llenar los datos correspondientes
    const personaData = await determinarTipoPersona(req);

    //Crear la persona y la cuenta
    prisma.persona
        .create({
            data: personaData,
            include: {
                cuenta: true,
                docente: true,
                estudiante: true,
            },
        })
        .then((data) => {
            data = excluirCampos(data, ['id', 'cuenta.id', 'docente.id', 'estudiante.id', 'cuenta.rol_id', 'cuenta.personaId', 'docente.personaId', 'estudiante.personaId']);
            res.json({ msj: "OK", data: data });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ msj: "Error al registrar la cuenta", error: error });
        });
});


router.post('/', async (req, res) => {

    const claveHashed = await bcrypt.hash('admin', 10)
    let rolAdmin
    try {
        const rolDocente = await prisma.rol.create({
            data: {
                nombre: 'Docente',
                descripcion: 'Rol de docente'
            }
        })

        const rolEstudiante = await prisma.rol.create({
            data: {
                nombre: 'Estudiante',
                descripcion: 'Rol de estudiante'
            }
        })

        rolAdmin = await prisma.rol.create({
            data: {
                nombre: 'Administrador',
                descripcion: 'Rol de administrador'
            }
        })
    } catch (error) {
        console.log("Roles ya creados, procediendo a crear cuenta de administrador");
    }

    const cuentaAdmin = await prisma.persona.create({
        data: {
            identificacion: '0000000000',
            nombre: 'Administrador',
            apellido: 'Administrador',
            direccion: 'Administrador',
            telefono: '0000000000',
            cuenta: {
                create: {
                    correo: 'admin@gmail.com',
                    clave: claveHashed,
                    rol: {
                        connect: {
                            id: rolAdmin ? rolAdmin.id : 3
                        }
                    }
                }
            }
        }
    })

    if (!rolAdmin) return res.json({ msj: "OK" });
    if (rolDocente && rolEstudiante && rolAdmin && cuentaAdmin) return res.json({ msj: "OK" });
})
//Ruta para iniciar sesión
router.post('/cuenta/login', (req, res) => {

    //Recuperar el correo y a clave de la solicitud
    const { correo, clave } = req.body;

    //Buscar la cuenta en la base de datos
    prisma.cuenta.findUnique({
        where: {
            correo: correo
        },
        include: {
            rol: true,
            persona: {
                include: {
                    docente: true,
                    estudiante: true
                }
            }
        }
    }).then(async (usuario) => {
        //Si no se encuentra la cuenta, se responde con un mensaje de error
        const claveCorrecta = !usuario ? false : await bcrypt.compare(clave, usuario.clave)
        if (!(usuario && claveCorrecta)) return res.status(401).json({ error: 'Credenciales incorrectas' });

        //Excluir id y campos de relacion de la respuesta
        usuario = excluirCampos(usuario, [
            'id', 'rol_id', 'personaId', 'persona.id', 'persona.docente.personaId', 'persona.estudiante.personaId', 'persona.docente.id', 'persona.estudiante.id', 'rol.id']);

        //Indicar los parametros que se tomara de base para crear el token
        const parametrosToken = {
            usuario: usuario,
        }

        //Crear el token
        const token = jwt.sign(parametrosToken, process.env.SECRET_KEY, {
            expiresIn: 60 * 60 * 24
        })

        //Responder con el token y el usuario
        return res.json({ msj: "OK", usuario: usuario, token: 'Bearer ' + token })
    })

})

router.get('/cuenta', validarToken, (req, res) => {
    prisma.cuenta.findMany({
        include: {
            rol: true,
            persona: {
                include: {
                    docente: true,
                    estudiante: true
                }
            }
        }
    }).then((data) => {
        data = excluirCampos(data, [
            'id', 'rol_id', 'personaId', 'persona.id', 'persona.docente.personaId', 'persona.estudiante.personaId', 'persona.docente.id', 'persona.estudiante.id', 'rol.id'])
        res.json({ msj: "OK", data: data });
    })
})

router.get('/cuenta/:external_id', validarToken, (req, res) => {
    try {
        prisma.cuenta.findUnique({
            where: {
                externalId: req.params.external_id
            },
            include: {
                rol: true,
                persona: {
                    include: {
                        docente: true,
                        estudiante: true
                    }
                }
            }
        }).then((data) => {
            if (!data) return res.status(400).json({ msj: "Error al obtener la cuenta", error: "Cuenta no encontrada" });
            data = excluirCampos(data, [
                'id', 'rol_id', 'personaId', 'persona.id', 'persona.docente.personaId', 'persona.estudiante.personaId', 'persona.docente.id', 'persona.estudiante.id', 'rol.id'])
            res.json({ msj: "OK", data: data });
        })
    } catch (err) {
        console.log(err);
    }
})

router.put('/cuenta/:external_id', validarToken, verificarCedulaUnica, verificarCorreoUnico, async (req, res) => {

    if (req.body.clave) req.body.clave = await bcrypt.hash(req.body.clave, 10)
    const { error } = validarFormatoEdicion(req);

    if (error) {
        // Si hay un error de validación, se responde con un mensaje de error personalizado
        const errorMessage = error.details[0].message || "Error en la validación";

        if (error.details[0].type === 'any.invalid') {
            return res.status(400).json({ msj: "Hace falta un campo en la peticion o algun campo es incorrecto", error: "No se puede tener valores para 'docente' y 'estudiante' al mismo tiempo" });
        }

        return res.status(400).json({ msj: "Hace falta un campo en la peticion o algun campo es incorrecto", error: errorMessage });
    }



    const cuenta = await prisma.cuenta.findMany({
        where: {
            persona:{
                externalId: req.params.external_id
            }
        },
        include: {
            rol: true,
            persona: {
                include: {
                    docente: true,
                    estudiante: true
                }
            }
        }
    })
    if (!cuenta[0]) return res.status(400).json({ msj: "Error al editar la cuenta", error: "Cuenta no encontrada" });
    
    prisma.cuenta.update({
        where: {
            externalId: cuenta[0].externalId
        },
        data: req.body.rol ? {
            correo: req.body.correo,
            clave: req.body.clave,
            rol: {
                connect: {
                    nombre: req.body.rol
                }
            },
            persona: {
                update: determinarEdicionDocenteEstudiante(cuenta[0], req)
            }
        } : {
            correo: req.body.correo,
            clave: req.body.clave,
            persona: {
                update: determinarEdicionDocenteEstudiante(cuenta[0], req)
            }
        },
        include: {
            rol: true,
            persona: {
                include: {
                    docente: true,
                    estudiante: true
                }
            }
        }
    }).then((data) => {
        data = excluirCampos(data, [
            'id', 'rol_id', 'personaId', 'persona.id', 'persona.docente.personaId', 'persona.estudiante.personaId', 'persona.docente.id', 'persona.estudiante.id', 'rol.id'])
        res.json({ msj: "Cuenta editada con exito", data: data });
    }).catch((error) => {
        console.log(error);
        if (error.meta && error.meta.cause.includes("Rol")) return res.status(400).json({ msj: "Error al editar la cuenta", error: "Rol no encontrado" });
        res.status(500).json({ msj: "Error al editar la cuenta", error: "Cuenta no encontrada" });
    })
})

router.put('/cuenta/:external_id/:rol', validarToken, async (req, res) => {
    const cuenta = await prisma.cuenta.update({
        where: {
            externalId: req.params.external_id
        },
        data: {
            rol: {
                connect: {
                    nombre: req.params.rol
                }
            }
        },
        include: {
            rol: true,
            persona: {
                include: {
                    docente: true,
                    estudiante: true
                }
            }
        }
    }).then((data) => {
        data = excluirCampos(data, [
            'id', 'rol_id', 'personaId', 'persona.id', 'persona.docente.personaId', 'persona.estudiante.personaId', 'persona.docente.id', 'persona.estudiante.id', 'rol.id'])
        res.json({ msj: "Rol asignado con exito", data: data });
    }).catch((error) => {
        console.log(error);
        if (error.meta && error.meta.cause.includes("Rol")) return res.status(400).json({ msj: "Error al asignar el rol", error: "Rol no encontrado" });
        res.status(500).json({ msj: "Error al asignar el rol", error: "Cuenta no encontrada" });
    })
})

router.delete('/cuenta/:external_id', validarToken, async (req, res) => {
    const cuenta = await prisma.cuenta.findUnique({
        where: {
            externalId: req.params.external_id
        },
        include: {
            rol: true,
            persona: {
                include: {
                    docente: true,
                    estudiante: true
                }
            }
        }
    })
    prisma.persona.delete({
        where: {
            externalId: cuenta.persona.externalId
        }
    }).then((data) => {
        res.json({ msj: "Cuenta eliminada con exito", data: data });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ msj: "Error al eliminar la cuenta", error: "Cuenta no encontrada" });
    })
})

router.put('/persona/firma/:external_id', upload.single('firma'), async (req, res) => {
    cloudinary.uploader.upload(req.file.path,
        { public_id: req.file.filename, folder: "firma" },
        async (error, result) => {
            const persona = await prisma.persona.update({
                where: {
                    externalId: req.params.external_id
                },
                data: {
                    firma: result.secure_url
                }
            }).then((data) => {
                res.json({ msj: "Firma asignada con exito", data: data });
            }).catch((error) => {
                console.log(error);
                res.status(500).json({ msj: "Error al asignar la firma", error: "Cuenta no encontrada" });
            })
        });
})

export default router;