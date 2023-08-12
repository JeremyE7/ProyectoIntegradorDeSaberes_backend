import express from 'express'

import cuentaRoutes from './routes/Cuenta.routes.js'
import docenteRoutes from './routes/Docente.routes.js'
import estudianteRoutes from './routes/Estudiante.routes.js'
import materiaRoutes from './routes/Materia.routes.js'
import personaRoutes from './routes/Persona.routes.js'
import rolRoutes from './routes/Rol.routes.js'
import registroTutoriasRoutes from './routes/RegistroTutorias.routes.js'
import tutoriaRoutes from './routes/Tutoria.routes.js'

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Credentials", '*');
  next();
});


app.use(express.json())

app.use('/api/v1', cuentaRoutes)
app.use('/api/v1', docenteRoutes)
app.use('/api/v1', estudianteRoutes)
app.use('/api/v1', materiaRoutes)
app.use('/api/v1', personaRoutes)
app.use('/api/v1', rolRoutes)
app.use('/api/v1', registroTutoriasRoutes)
app.use('/api/v1', tutoriaRoutes)


app.listen(3000)
console.log('Server on port', 3000);