import { prisma } from "../db.js";

export const verificarCedulaUnica = async (req, res, next) => {

    if (req.body.persona.identificacion) {
        const persona = await prisma.persona.findUnique({
            where: {
                identificacion: req.body.persona.identificacion
            },

        })

        const cuenta = await prisma.cuenta.findUnique({
            where: {
                externalId: req.params.external_id
            },
            include: {
                persona: true
            }
        })

        console.log(req.params.external_id);
        console.log(persona);
        if (persona && persona.externalId !== cuenta.persona.externalId) return res.status(400).json({ msj: "Error en la solicitud", error: 'Identificacion ya registrada' })
    }

    next();
}