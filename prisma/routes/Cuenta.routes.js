import { Router } from "express";
import { prisma } from "../db.js";
import { determinarTipoPersona, validarFormatoRegistro } from "../logic/registroLogic.js";
import { excluirCampos } from "../logic/exclusionLogic.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

//Ruta para registrar una nueva cuenta
router.post('/cuenta/registrar', async (req, res) => {

    //Verificar que no se intente crear una cuenta de tipo docente y estudiante a la vez
    const { docente, estudiante } = req.body;
    if (docente && estudiante) return res.json({ error: 'Cuenta no puede ser de docente y estudiante al mismo tiempo' })

    // Valida los campos del cuerpo de la solicitud
    const { error } = validarFormatoRegistro(req);

    if (error) {
        // Si hay un error de validación, se responde con un mensaje de error
        return res.status(400).json({msj: "Hace falta un campo en la peticion", error: error.details[0].message });
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
            res.json({msj: "OK", data: data});
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ msj: "Error al registrar la cuenta" , error: error});
        });
});

//Ruta para iniciar sesión
router.post('/cuenta/login', (req, res) => {
    
    //Recuperar el correo y a clave de la solicitud
    const {correo, clave} = req.body;

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
        if(!(usuario && claveCorrecta)) return res.status(401).json({error: 'Credenciales incorrectas'});

        //Excluir id y campos de relacion de la respuesta
        usuario = excluirCampos(usuario, [
            'id', 'rol_id', 'personaId', 'persona.id', 'persona.docente.personaId', 'persona.estudiante.personaId', 'persona.docente.id', 'persona.estudiante.id', 'rol.id']);
        
        //Indicar los parametros que se tomara de base para crear el token
        const parametrosToken = {
            usuario: usuario,            
        }

        //Crear el token
        const token = jwt.sign(parametrosToken, process.env.SECRET_KEY, {
            expiresIn: 60*60*24
        })

        //Responder con el token y el usuario
        return res.json({msj: "OK", usuario: usuario, token: 'Bearer ' + token})
    })

})

export default router;