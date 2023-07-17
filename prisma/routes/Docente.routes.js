import { Router } from "express";
import { prisma } from "../db.js";
import { excluirCampos } from "../logic/exclusionLogic.js";

const router = Router();

router.get("/docente/listar",async(req, res)=>{
    var docentes = await prisma.docente.findMany({
        include:{
            persona: true
        }
    })
    docentes =  excluirCampos(docentes,['id','personaId','persona.id'])
    return res.json({msg: "Ok", data: docentes})
})

router.get("/docente/obtener/:external", async(req,res)=>{
    var docente = await prisma.docente.findUnique({
        where : {
            externalId: req.params.external     
        },
        include:{
            persona: true
        }
    });
    if(!docente) return res.status(200).json({msg: "Estudiante no encontrado"});
    docente = excluirCampos(docente,['id','personaId','persona.id'])
    return res.json(docente);
})

export default router;