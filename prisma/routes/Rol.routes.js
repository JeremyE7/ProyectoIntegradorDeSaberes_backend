
import { Router } from "express";
import { prisma } from "../db.js";
import { validarToken } from "../middlewares/tokenLogic.js";

const router = Router();

router.post("/rol/guardar", async(req, res)=>{
    try {
        const newRol = await prisma.rol.create({
            data : req.body,
        })
        res.status(200);
        res.json({msg: "Se ha registrado los datos",code:200});
    } catch (error) {
        res.status(400);
        res.json({msg: "Faltan datos",code: 400});
    }
})

router.get("/rol/obtener/:external", validarToken, async(req, res)=>{
    req.params.external
    const rol = await prisma.rol.findUnique({
        where : {
            externalId: req.params.external     
        },
    });
    if(!rol) return res.status(200).json({msg: "Rol no encontrado"});
    delete rol['id'];
    return res.json(rol);
})

router.get("/rol/listar", validarToken, async(req, res)=>{
    const roles = await prisma.rol.findMany()
    for(const rol of roles){
        delete rol['id']
    }
    return res.json({msg: "Ok", data: roles})
})
export default router;