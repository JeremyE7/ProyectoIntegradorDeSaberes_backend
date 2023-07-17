import { Router } from "express";
import { prisma } from "../db.js";
import { excluirCampos } from "../logic/exclusionLogic.js";


const router = Router();

router.get("/estudiante/listar",async(req, res)=>{
    var estudiantes = await prisma.estudiante.findFirst({
        include:{
            persona: true
        }
    })
    estudiantes =  excluirCampos(estudiantes,['id','personaId','persona.id'])
    return res.json({msg: "Ok", data: estudiantes})
})

export default router;