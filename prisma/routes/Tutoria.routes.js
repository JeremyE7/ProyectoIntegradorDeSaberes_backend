import { Router } from "express";
import { prisma } from "../db.js";
import { validarCambiarEstadoTutoriaDocente, validarFormatoCrearTutoriaDocente, validarFormatoCrearTutoriaEstudiante } from "../logic/tutoriaLogic.js";
import { excluirCampos } from "../logic/exclusionLogic.js";
import { sendEmail } from "../logic/sendEmailsLogic.js";

const router = Router();

// Obtener todas las tutorías
router.get('/tutorias', async (req, res) => {
    try {
        const tutorias = await prisma.tutoria.findMany({ include: { estudiantes: {
            include: {
                persona: true
            }
        }, materia: true} });
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
        const tutorias = await prisma.tutoria.findMany({ where: { docenteId: docente.id }, include:{estudiantes: { include: {persona: true}}, docente: { include: {persona: true}}, materia: true} });
        res.json({ msj: "OK", data: tutorias });
    } catch (error) {
        console.error("Error al obtener las tutorías del docente:", error);
        res.status(500).json({ msj: "ERROR", error: "Error al obtener las tutorías del docente" });
    }
});

// Obtener todas las tutorías de un estudiante por external_id
router.get('/tutorias/estudiante/:external_id_estudiante', async (req, res) => {
    const { external_id_estudiante } = req.params;

    try {
        const estudiante = await prisma.estudiante.findUnique({ where: { externalId: external_id_estudiante } });
        if (!estudiante) {
            return res.status(404).json({ msj: "ERROR", error: "Estudiante no encontrado" });
        }
        const tutorias = await prisma.tutoria.findMany({ where: { estudiantes: {some:{
            externalId: external_id_estudiante
        }} }, include:{estudiantes: { include: {persona: true}},docente: { include: {persona: true}}, materia: true} });
        res.json({ msj: "OK", data: tutorias });
    } catch (error) {
        console.error("Error al obtener las tutorías del estudiante:", error);
        res.status(500).json({ msj: "ERROR", error: "Error al obtener las tutorías del estudiante" });
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
            },
            include: {
                persona: true
            }
        });

        if (!estudiante) {
            return res.status(404).json({ msj: "ERROR", error: "Estudiante no encontrado" });
        }

        const { external_id_docente, external_id_materia } = req.body;

        const docente = await prisma.docente.findUnique({
            where: {
                externalId: external_id_docente
            }, include: {
                persona: {
                    include: {
                        cuenta: true
                    }
                }
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
                nombreTutoria: req.body.nombreTutoria,
                descripcion: req.body.descripcion,
                estado: "Espera",
                tipoReunionTutoria: req.body.tipoReunionTutoria,
            },
            include: {
                estudiantes: true
            }
        });

        if (tutoriaCreada[0]) {
                return res.status(400).json({ msj: "ERROR", error: "Estudiante ya solicitó esta tutoria" });
        }

        let tutoria = await prisma.tutoria.create({
            data: {
                estado: "Espera",
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
                },
                docente:{
                    connect:{
                        id: docente.id
                    }
                },
                nombreTutoria: req.body.nombreTutoria,
                descripcion: req.body.descripcion,
                tipoReunionTutoria: req.body.tipoReunionTutoria,
            },
            include: {
                materia: true,
                registroTutorias: true,
                estudiantes: true,
                
            }
        });

        tutoria = excluirCampos(tutoria, ["id", "registroTutoriasId", "materiaId", "estudiantesId", "materia.id", "registroTutorias.id", "estudiantes.id", "materia.docente.id", "registroTutorias.docente.id", "estudiante.personaId"]);
        await sendEmail(docente.persona.cuenta.correo, "Solicitud de tutoría", `El estudiante ${estudiante.persona.nombre} ${estudiante.persona.apellido} ha solicitado una tutoría con usted, por favor ingrese a la plataforma para aceptar o rechazar la solicitud.`)
        return res.json({ msj: "OK", data: tutoria });

    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).json({ msj: "ERROR", error: "Error al procesar la solicitud" });
    }
});


// Actualizar una tutoría por external_id para docentes
router.put('/tutorias/docente/aceptar/:external_id', async (req, res) => {

    const { error } = validarFormatoCrearTutoriaDocente(req.body);

    if (error) {
        return res.status(400).json({ msj: "Falta algun campo o es incorrecto", error: error.details[0].message });
    }
    const { fecha} = req.body;
    try {
        const tutoria = await prisma.tutoria.update({
            where: { externalId: req.params.external_id },
            data: {
                fechaInicio: fecha,
                estado: "Aceptada",
                justificacion: req.body.justificacion,
            },
            include: {
                estudiantes: {
                    include: {
                        persona: {
                            include: {
                                cuenta: true
                            }
                        }
                    }
                },
                materia: true,
                docente: {
                    include: {
                        persona: {
                            include: {
                                cuenta: true
                            }
                        }
                    }
                },
                registroTutorias: true,
            }
        });
        if(req.body.justificacion){
            await sendEmail(tutoria.estudiantes[0].persona.cuenta.correo, "Tutoría reagendada", `El docente ${tutoria.docente.persona.nombre} ${tutoria.docente.persona.apellido} ha reagendado la tutoria de nombre ${tutoria.nombreTutoria} para la fecha: ${new Date(tutoria.fechaInicio).toLocaleString()}. Por favor ingrese a la plataforma para ver los detalles.`)
        }else{
            console.log(tutoria.estudiantes[0].persona.cuenta.correo);
            await sendEmail(tutoria.estudiantes[0].persona.cuenta.correo, "Tutoría aceptada", `El docente ${tutoria.docente.persona.nombre} ${tutoria.docente.persona.apellido} ha aceptado su solicitud de tutoría para la fecha ${new Date(tutoria.fechaInicio).toLocaleString()}, por favor ingrese a la plataforma para ver los detalles.`)
        }
        res.json({ msj: "OK", data: tutoria });
    } catch (error) {
        console.error("Error al actualizar la tutoría:", error);
        res.status(500).json({ msj: "ERROR", error: "Tutoria no actualizada" });
    }
});

//Cambiar estado de una tutoria a cancelado o finalizado
router.put('/tutorias/estado/:external_id', async (req, res) => {
    const {error} = validarCambiarEstadoTutoriaDocente(req.body)
    if (error) {
        return res.status(400).json({ msj: "Falta algun campo o es incorrecto", error: error.details[0].message });
    }
    const { estado, fechaFinalizacion } = req.body;
    try {
        const tutoria = await prisma.tutoria.update({
            where: { externalId: req.params.external_id },
            data: {
                estado: estado,
                fechaFinalizacion: fechaFinalizacion,
                justificacion: req.body.justificacion,
                observacionDocente: req.body.observacionDocente,
                valoracion: req.body.valoracion,
                observacionEstudiante: req.body.observacionEstudiante,
            },
            include: {
                estudiantes: {
                    include: {
                        persona: {
                            include: {
                                cuenta: true
                            }
                        }
                    }
                },
                materia: true,
                docente: {
                    include: {
                        persona: {
                            include: {
                                cuenta: true
                            }
                        }
                    }
                },
                registroTutorias: true,
            }
        });
        
        if(estado == "Semirealizada"){
            await sendEmail(tutoria.estudiantes[0].persona.cuenta.correo, "Tutoría casi completa", `El docente ${tutoria.docente.persona.nombre} ${tutoria.docente.persona.apellido} ha finalizado la tutoria de nombre ${tutoria.nombreTutoria}, por favor ingrese a la plataforma para valorarla y añadir observaciones.`)
        }else if(estado === "Realizada"){
            await sendEmail(tutoria.docente.persona.cuenta.correo, "Tutoría realizada", `El estudiante ${tutoria.estudiantes[0].persona.nombre} ${tutoria.estudiantes[0].persona.apellido} ha valorado la tutoría de nombre ${tutoria.nombreTutoria}, por favor ingrese a la plataforma para revisar los detalles.`)
        }else if(estado === "Rechazada"){
            await sendEmail(tutoria.estudiantes[0].persona.cuenta.correo, "Tutoría cancelada", `La tutoria de la materia ${tutoria.materia.nombre} ${tutoria.fechaInicio ? `asignada para la fecha ${new Date(tutoria.fechaInicio).toLocaleString()}`: ''} ha sido cancelada, por favor ingrese a la plataforma para revisar los detalles.`)
            await sendEmail(tutoria.docente.persona.cuenta.correo, "Tutoría cancelada", `La tutoria de la materia ${tutoria.materia.nombre} asignada para la fecha ${new Date(tutoria.fechaInicio).toLocaleString()} ha sido cancelada, por el motivo: ${tutoria.justificacion} por favor ingrese a la plataforma para revisar los detalles.`)
        }


        res.json({ msj: "OK", data: tutoria });
    } catch (error) {
        console.error("Error al actualizar la tutoría:", error);
        res.status(500).json({ msj: "ERROR", error: "Tutoria no actualizada" });
    }
});

export default router;
