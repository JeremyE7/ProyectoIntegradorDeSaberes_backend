import { prisma } from "../db.js";

export const verificarCorreoUnico = async (req, res, next) => {
    console.log(req.body);
    if (req.body.correo) {
        const cuenta = await prisma.cuenta.findMany({
            where: {
                correo: req.body.correo,
                persona: {
                    externalId: {
                        not: req.params.external_id
                    }
                }
            },
        })
        if (cuenta.length > 0) return res.status(400).json({ msj: "Error en la solicitud", error: 'Correo ya registrado' })
    }

    next();
}