import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/docente/listar",async(req, res)=>{
    const docentes = await prisma.docente.findMany({
        include:{
            persona: true
        }
    })
    return res.json({msg: "Ok", data: docentes})
})

export default router;