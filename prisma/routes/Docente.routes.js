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

export default router;