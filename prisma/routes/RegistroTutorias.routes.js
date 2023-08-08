import { Router } from "express";
import { prisma } from "../db.js";
import { validarFormatoCrearRegistroTutoria } from "../logic/registroTutoriaLogic.js";
import { excluirCampos } from "../logic/exclusionLogic.js";


const router = Router();

router.get('/registro_tutorias', async (req, res) => {
    const registro_tutorias = await prisma.registroTutorias.findMany().catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Registro de tutorias no encontradas" });
    });
    res.json({ msj: "OK", data: registro_tutorias });
});

router.get('/registro_tutorias/:external_id', async (req, res) => {
    const { external_id } = req.params;
    const registro_tutorias = await prisma.registro_tutorias.findUnique({
        where: {
            external_id: external_id
        }
    }).catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Registro de tutorias no encontrada" });
    });
    res.json({ msj: "OK", data: registro_tutorias });
});

router.get('/registro_tutorias/docente/:external_id_docente', async (req, res) => {
    const { external_id_docente } = req.params;
    const docente = await prisma.docente.findUnique({
        where: {
            external_id: external_id_docente
        }
    }).catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Docente no encontrado" });
    }
    );
    const registro_tutorias = await prisma.registro_tutorias.findMany({
        where: {
            id_docente: docente.id
        }
    }).catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Registro de tutorias no encontradas" });
    }
    );
    res.json({ msj: "OK", data: registro_tutorias });
});

router.post('/registro_tutorias', async (req, res) => {

    const docente = await prisma.docente.findUnique({
        where: {
            externalId: req.body.externalIdDocente
        }
    }).catch((err) => {
        return res.status(404).json({ msj: "ERROR", error: "Docente no encontrado" });
    });

    const registroTutoriasCreado = await prisma.registroTutorias.findUnique({
        where: {
            docenteId: docente.id,
        }
    })

    if(registroTutoriasCreado) return res.status(400).json({ msj: "ERROR", error: "Registro de tutorias ya creado" });

    const {error} = validarFormatoCrearRegistroTutoria(req.body);

    if (error) {
        // Si hay un error de validación, se responde con un mensaje de error
        return res.status(400).json({ msj: "Hace falta un campo en la peticion", error: error.details[0].message });
    }

    console.log("adawd");

    prisma.registroTutorias.create({
        data: {
            periodoAcademico: req.body.periodoAcademico,
            docente: {
                connect: {
                    externalId: req.body.externalIdDocente
                }
            }
        },
        include: {
            docente: true
        }
    }).then((registro_tutorias) => {
        registro_tutorias = excluirCampos(registro_tutorias, ["docenteId", "id", "docente.id", "docente.personaId"]);
        return res.json({ msj: "OK", data: registro_tutorias });
    }).catch((err) => {
        console.log(err);
        return res.status(404).json({ msj: "ERROR", error: "Registro de tutorias no creada" });
    });
});

router.put('/registro_tutorias/:external_id', async (req, res) => {
    const { external_id } = req.params;
    const { periodoAcademico, externalIdDocente } = req.body;
    const docente = await prisma.docente.findUnique({
        where: {
            external_id: externalIdDocente
        }
    }).catch((err) => {
        return res.status(404).json({ msj: "ERROR", error: "Docente no encontrado" });
    }
    );
    const registro_tutorias = await prisma.registro_tutorias.update({
        where: {
            external_id: external_id
        },
        data: {
            periodoAcademico: periodoAcademico,
            id_docente: docente.id
        }
    }).catch((err) => {
        return res.status(404).json({ msj: "ERROR", error: "Registro de tutorias no encontrada" });
    }
    );
    return res.json({ msj: "OK", data: registro_tutorias });
});

router.post('/registro_tutorias/:external_id/:tutoria_id', async (req, res) => {
    const { external_id, tutoria_id } = req.params;
    const registro_tutorias = await prisma.registro_tutorias.update({
        where: {
            external_id: external_id
        },
        data: {
            tutorias: {
                connect: {
                    id: tutoria_id
                }
            }
        }
    }).catch((err) => {
        return res.status(404).json({ msj: "ERROR", error: "Registro de tutorias no encontrada" });
    }
    );
    return res.json({ msj: "OK", data: registro_tutorias });
})




export default router;
