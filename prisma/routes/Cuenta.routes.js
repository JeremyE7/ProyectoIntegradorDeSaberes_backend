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
const router = Router();

//Ruta para registrar una nueva cuenta
router.post('/cuenta/registrar', async (req, res) => {

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
        data = excluirCampos(data, [
            'id', 'rol_id', 'personaId', 'persona.id', 'persona.docente.personaId', 'persona.estudiante.personaId', 'persona.docente.id', 'persona.estudiante.id', 'rol.id'])
        res.json({ msj: "OK", data: data });
    })
})

router.put('/cuenta/:external_id', validarToken, verificarCedulaUnica, async (req, res) => {

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

    prisma.cuenta.update({
        where: {
            externalId: req.params.external_id
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
                update: determinarEdicionDocenteEstudiante(cuenta, req)
            }
        } : {
            correo: req.body.correo,
            clave: req.body.clave,
            persona: req.body.persona
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
        if(error.meta.cause.includes("Rol")) return res.status(400).json({ msj: "Error al editar la cuenta", error: "Rol no encontrado" });
        res.status(500).json({ msj: "Error al editar la cuenta", error: "Cuenta no encontrada" });
    })
})

export default router;