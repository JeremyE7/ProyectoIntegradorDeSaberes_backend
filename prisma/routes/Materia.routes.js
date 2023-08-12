import { Router } from "express";
import { prisma } from "../db.js";
import { validarFormatoCrearMateria } from "../logic/materiaLogic.js";
import { excluirCampos } from "../logic/exclusionLogic.js";


const router = Router();

router.get('/materias', async (req, res) => {
    const materias = await prisma.materia.findMany({include:{docente: {include:{persona: true}}}}).then(
        (res) => {
            res = excluirCampos(res, ["docenteId","docente.id","docente.personaId"]);
            return res
        }
    ).catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Materias no encontradas" });
    });
    res.json({ msj: "OK", data: materias });
});

router.get('/materias/:external_id', async (req, res) => {
    const { external_id } = req.params;
    const materia = await prisma.materia.findUnique({
        where: {
            external_id: external_id
        }
    }).catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Materia no encontrada" });
    });
    res.json({ msj: "OK", data: materia });
});

router.get('/materias/docente/:external_id_docente', async (req, res) => {
    const { external_id_docente } = req.params;
    const docente = await prisma.docente.findUnique({
        where: {
            externalId: external_id_docente
        }
    }).catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Docente no encontrado" });
    }
    );
    const materias = await prisma.materia.findMany({
        where: {
            docenteId: docente.id
        }
    }).catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Materias no encontradas" });
    }
    );
    res.json({ msj: "OK", data: materias });
});

router.post('/materias', async (req, res) => {

    const { error } = validarFormatoCrearMateria(req.body);

    if (error) {
        // Si hay un error de validación, se responde con un mensaje de error
        return res.status(400).json({ msj: "Hace falta un campo en la peticion", error: error.details[0].message });
    }

    const { nombre, external_id_docente } = req.body;
    const docente = await prisma.docente.findUnique({
        where: {
            externalId: external_id_docente
        }
    }).catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Docente no encontrado" });
    }
    );

    console.log(docente);

    let materia = await prisma.materia.create({
        data: {
            nombre: nombre,
            docente: {
                connect: {
                    id: docente.id
                },
            },
        },
        include: {
            docente: true
        }
    }).catch((err) => {
        console.log(err);
        res.status(404).json({ msj: "ERROR", error: "Materia no creada" });
    }
    );

    materia = excluirCampos(materia, ["docenteId","id","docente.id","docente.personaId"]);
    res.json({ msj: "OK", data: materia });
});

router.put('/materias/:external_id', async (req, res) => {
    const { external_id } = req.params;
    const { nombre, external_id_docente } = req.body;
    console.log(external_id_docente);
    const docente = await prisma.docente.findUnique({
        where: {
            externalId: external_id_docente
        }
    }).catch((err) => {
        console.log('docente no encontrado', err);
        return res.status(404).json({ msj: "ERROR", error: "Docente no encontrado" });
    }
    );
    console.log(docente);
    const materia = await prisma.materia.update({
        where: {
            externalId: external_id
        },
        data: {
            nombre: nombre,
            docente: {
                connect: {
                    id: docente.id
                },
            },
        },
        include: {
            docente: true
        }
    }).catch((err) => {
        console.log(err);
        res.status(404).json({ msj: "ERROR", error: "Materia no actualizada" });
    }
    );
    res.json({ msj: "OK", data: materia });
});

router.delete('/materias/:external_id', async (req, res) => {
    const { external_id } = req.params;
    const materia = await prisma.materia.delete({
        where: {
            externalId: external_id
        }
    }).catch((err) => {
        res.status(404).json({ msj: "ERROR", error: "Materia no eliminada" });
    }
    );
    res.json({ msj: "OK", data: materia });
});

export default router;
