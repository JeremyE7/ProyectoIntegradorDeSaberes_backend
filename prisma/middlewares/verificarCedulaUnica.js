import { prisma } from "../db.js";

export const verificarCedulaUnica = async (req, res, next) => {
    console.log(req.body);
    console.log(req.params.external_id);
    if (req.body.identificacion) {
        const persona = await prisma.persona.findMany({
            where: {
                identificacion: req.body.identificacion,
                externalId:{
                    not: req.params.external_id
                }
            },
            
        })
        console.log("===========", persona);
        if (persona.length > 0) return res.status(400).json({ msj: "Error en la solicitud", error: 'Identificacion ya registrada' })
    }

    next();
}