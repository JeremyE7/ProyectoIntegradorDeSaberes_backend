import jwt from 'jsonwebtoken';

export const validarToken = (req, res, next) => {
  const authorization = req.get('authorization');
  let token = '';

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    token = authorization.split(' ')[1];
  } else {
    return res.status(401).json({ msj: "No autorizado", error: "Token no válido o faltante" });
  }

  try {
    const tokenDecodificado = jwt.verify(token, process.env.SECRET_KEY);

    if (!token || !tokenDecodificado.usuario) {
      return res.status(401).json({ msj: "No autorizado", error: "Token no válido o faltante" });
    }

    // Llamar a next() para pasar al siguiente middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msj: "No autorizado", error: "Error al verificar el token" });
  }
};
