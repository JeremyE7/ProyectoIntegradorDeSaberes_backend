import { Router } from "express";
import { prisma } from "../db.js";
import { excluirID } from "../logic/exclusionLogic.js";


const router = Router();

router.get("/estudiante/listar",async(req, res)=>{
    var estudiantes = await prisma.estudiante.findMany({
        include:{
            persona: true
        }
    })
    estudiantes =  excluirID(estudiantes,['id','personaId','persona.id'])
    return res.json({msg: "Ok", data: estudiantes})
})

export default router;