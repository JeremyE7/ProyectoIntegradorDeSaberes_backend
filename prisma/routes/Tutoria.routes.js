import { Router } from "express";
import { prisma } from "../db.js";
import { validarFormatoCrearTutoriaDocente, validarFormatoCrearTutoriaEstudiante } from "../logic/tutoriaLogic.js";
import { excluirCampos } from "../logic/exclusionLogic.js";

const router = Router();

// Obtener todas las tutorías
router.get('/tutorias', async (req, res) => {
    try {
        const tutorias = await prisma.tutoria.findMany({ include: { estudiantes: true } });
        res.json({ msj: "OK", data: tutorias });
    } catch (error) {
        console.error("Error al obtener las tutorías:", error);
        res.status(500).json({ msj: "ERROR", error: "Error al obtener las tutorías" });
    }
});

// Obtener una tutoría por external_id
router.get('/tutorias/:external_id', async (req, res) => {
    const { external_id } = req.params;
    try {
        const tutoria = await prisma.tutoria.findUnique({ where: { externalId: external_id } });
        if (!tutoria) {
            return res.status(404).json({ msj: "ERROR", error: "Tutoria no encontrada" });
        }
        res.json({ msj: "OK", data: tutoria });
    } catch (error) {
        console.error("Error al obtener la tutoría:", error);
        res.status(500).json({ msj: "ERROR", error: "Error al obtener la tutoría" });
    }
});

// Obtener todas las tutorías de un docente por external_id
router.get('/tutorias/docente/:external_id_docente', async (req, res) => {
    const { external_id_docente } = req.params;
    try {
        const docente = await prisma.docente.findUnique({ where: { externalId: external_id_docente } });
        if (!docente) {
            return res.status(404).json({ msj: "ERROR", error: "Docente no encontrado" });
        }
        const tutorias = await prisma.tutoria.findMany({ where: { id_docente: docente.id } });
        res.json({ msj: "OK", data: tutorias });
    } catch (error) {
        console.error("Error al obtener las tutorías del docente:", error);
        res.status(500).json({ msj: "ERROR", error: "Error al obtener las tutorías del docente" });
    }
});

// Crear una tutoría para un estudiante por external_id_estudiante
router.post('/tutorias/estudiante/:external_id_estudiante', async (req, res) => {
    const { error } = validarFormatoCrearTutoriaEstudiante(req.body);
    const { external_id_estudiante } = req.params;

    if (error) {
        return res.status(400).json({ msj: "Falta algun campo o es incorrecto", error: error.details[0].message });
    }

    try {
        const estudiante = await prisma.estudiante.findUnique({
            where: {
                externalId: external_id_estudiante
            }
        });

        if (!estudiante) {
            return res.status(404).json({ msj: "ERROR", error: "Estudiante no encontrado" });
        }

        const { external_id_docente, external_id_materia } = req.body;

        const docente = await prisma.docente.findUnique({
            where: {
                externalId: external_id_docente
            }
        });

        if (!docente) {
            return res.status(404).json({ msj: "ERROR", error: "Docente no encontrado" });
        }

        const registro_tutorias = await prisma.registroTutorias.findUnique({
            where: {
                docenteId: docente.id,
            }
        });

        if (!registro_tutorias) {
            return res.status(404).json({ msj: "ERROR", error: "Registro de tutorias no encontrado" });
        }

        const materia = await prisma.materia.findUnique({
            where: {
                externalId: external_id_materia
            }
        });

        if (!materia) {
            return res.status(404).json({ msj: "ERROR", error: "Materia no encontrada" });
        }

        let tutoriaCreada = await prisma.tutoria.findMany({
            where: {
                registroTutoriasId: registro_tutorias.id,
                materiaId: materia.id,
                estado: "ESPERA",
            },
            include: {
                estudiantes: true
            }
        });

        if (tutoriaCreada[0]) {
            const estudianteYaSolicitado = tutoriaCreada[0].estudiantes.some((estudiante) => estudiante.externalId === external_id_estudiante);
            if (estudianteYaSolicitado) {
                return res.status(400).json({ msj: "ERROR", error: "Estudiante ya solicitó esta tutoria" });
            }

            await prisma.estudiante.update({
                where: {
                    externalId: external_id_estudiante
                },
                data: {
                    tutoria: {
                        connect: {
                            id: tutoriaCreada[0].id
                        }
                    }
                }
            });

            tutoriaCreada[0] = excluirCampos(tutoriaCreada[0], ["id", "registroTutoriasId", "materiaId", "estudiantesId", "materia.id", "registroTutorias.id", "estudiantes.id", "materia.docente.id", "registroTutorias.docente.id", "estudiante.personaId"]);
            return res.json({ msj: "Se ha añadido el estudiante a la siguiente tutoria", data: tutoriaCreada });
        }

        let tutoria = await prisma.tutoria.create({
            data: {
                estado: "ESPERA",
                registroTutorias: {
                    connect: {
                        id: registro_tutorias.id
                    }
                },
                estudiantes: {
                    connect: {
                        externalId: external_id_estudiante
                    }
                },
                materia: {
                    connect: {
                        id: materia.id
                    }
                }
            },
            include: {
                materia: true,
                registroTutorias: true,
                estudiantes: true
            }
        });

        tutoria = excluirCampos(tutoria, ["id", "registroTutoriasId", "materiaId", "estudiantesId", "materia.id", "registroTutorias.id", "estudiantes.id", "materia.docente.id", "registroTutorias.docente.id", "estudiante.personaId"]);
        return res.json({ msj: "OK", data: tutoria });

    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).json({ msj: "ERROR", error: "Error al procesar la solicitud" });
    }
});


// Actualizar una tutoría por external_id para docentes
router.put('/tutorias/docente/:external_id', async (req, res) => {

    const { error } = validarFormatoCrearTutoriaDocente(req.body);

    if (error) {
        return res.status(400).json({ msj: "Falta algun campo o es incorrecto", error: error.details[0].message });
    }
    const { fecha, estado, nombreTutoria, descripcion, duracion } = req.body;
    try {
        const tutoria = await prisma.tutoria.update({
            where: { externalId: req.params.external_id },
            data: {
                fecha: fecha,
                estado: estado,
                duracion: duracion,
                nombreTutoria: nombreTutoria,
                descripcion: descripcion,
            }
        });
        res.json({ msj: "OK", data: tutoria });
    } catch (error) {
        console.error("Error al actualizar la tutoría:", error);
        res.status(500).json({ msj: "ERROR", error: "Tutoria no actualizada" });
    }
});

export default router;
