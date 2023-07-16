import { Router } from "express";
import { prisma } from "../db.js";
import { determinarTipoPersona, validarFormatoRegistro } from "../logic/registroLogic.js";

const router = Router();

router.post('/cuenta/registrar', (req, res) => {

    //Verificar que no se intente crear una cuenta de tipo docente y estudiante a la vez
    const { docente, estudiante } = req.body;
    if (docente && estudiante) return res.json({ error: 'Cuenta no puede ser de docente y estudiante al mismo tiempo' })

    // Valida los campos del cuerpo de la solicitud
    const { error } = validarFormatoRegistro(req);

    if (error) {
        // Si hay un error de validación, se responde con un mensaje de error
        return res.status(400).json({ error: error.details[0].message });
    }

    const personaData = determinarTipoPersona(req);

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
            res.json(data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ msj: "Error al registrar la cuenta" , error: error});
        });
});


export default router;