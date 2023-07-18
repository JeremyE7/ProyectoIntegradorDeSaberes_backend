import { prisma } from "../db.js";

export const verificarCedulaUnica = async (req, res, next) => {
    if (req.body.persona.identificacion) {
        const persona = await prisma.persona.findUnique({
            where: {
                identificacion: req.body.persona.identificacion
            },

        })

        if (persona && persona.externalId !== req.params.external_id) return res.status(400).json({ msj: "Error en la solicitud", error: 'Identificacion ya registrada' })
    }

    next();
}