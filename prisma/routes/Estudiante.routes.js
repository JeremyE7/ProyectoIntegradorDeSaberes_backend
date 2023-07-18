import { Router } from "express";
import { prisma } from "../db.js";
import { excluirCampos } from "../logic/exclusionLogic.js";
import { validarToken } from "../middlewares/tokenLogic.js";


const router = Router();

router.get("/estudiante/listar", validarToken, async(req, res)=>{
    var estudiantes = await prisma.estudiante.findMany({
        include:{
            persona: true
        }
    })
    estudiantes =  excluirCampos(estudiantes,['id','personaId','persona.id'])
    return res.json({msg: "Ok", data: estudiantes})
})

router.get("/estudiante/obtener/:external", validarToken, async(req,res)=>{
    var estudiante = await prisma.estudiante.findUnique({
        where : {
            externalId: req.params.external     
        },
        include:{
            persona: true
        }
    });
    if(!estudiante) return res.status(200).json({msg: "Estudiante no encontrado"});
    estudiante = excluirCampos(estudiante,['id','personaId','persona.id'])
    return res.json(estudiante);
})

/**
 * Ruta para buscar estudiantes por parametro
 */
router.get("/estudiante/buscar/:tipo/:parametro", validarToken, async(req, res)=>{
    var estudiante
    switch (req.params.tipo) {
        case "identificacion":
            estudiante = await prisma.estudiante.findMany({
                where: {persona:{identificacion:req.params.parametro}},
                include:{persona:true}
            })
            break
        case "nombre":
            estudiante = await prisma.estudiante.findMany({
                where: {persona:{nombre:{startsWith:req.params.parametro}}},
                include:{persona:true}
            })
            break;
        default:
            return res.json({msg:"Parametro no valido"})           
    }
    console.log(estudiante)
    return (estudiante) ? res.json(excluirCampos(estudiante,['id','personaId','persona.id'])) : res.json({msg:"Estudiante no encontrado"})
})
export default router;