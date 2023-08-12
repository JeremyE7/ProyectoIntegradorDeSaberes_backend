import { prisma } from "../db.js";

export const verificarCedulaUnica = async (req, res, next) => {
    console.log(req.body);
    if (req.body.identificacion) {
        const persona = await prisma.persona.findUnique({
            where: {
                identificacion: req.body.identificacion
            },
        })
        if (persona) return res.status(400).json({ msj: "Error en la solicitud", error: 'Identificacion ya registrada' })
    }

    next();
}