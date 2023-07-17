import { Router } from "express";
import { prisma } from "../db.js";
import { excluirCampos } from "../logic/exclusionLogic.js";


const router = Router();

router.get("/estudiante/listar",async(req, res)=>{
    var estudiantes = await prisma.estudiante.findMany({
        include:{
            persona: true
        }
    })
    estudiantes =  excluirCampos(estudiantes,['id','personaId','persona.id'])
    return res.json({msg: "Ok", data: estudiantes})
})

router.get("/estudiante/obtener/:external", async(req,res)=>{
    req.params.external
    const estudiante = await prisma.estudiante.findUnique({
        where : {
            externalId: req.params.external     
        },
        include:{
            persona: true
        }
    });
    if(!estudiante) return res.status(200).json({msg: "Estudiante no encontrado"});
    estudiante = excluirCampos(estudiantes,['id','personaId','persona.id'])
    return res.json(rol);
})
export default router;