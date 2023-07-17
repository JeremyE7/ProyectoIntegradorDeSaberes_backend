import jwt from 'jsonwebtoken';

export const validarToken = (req, res) =>{
    const authorization = req.headers.authorization;
    let token = '';

    if(authorization && authorization.split(' ')[0] === 'Bearer'){
        token = authorization.split(' ')[1];
    }

    const tokenDecodificado = jwt.verify(token, process.env.SECRET_KEY);

    if(!token || !tokenDecodificado.id){
        return res.status(401).json({msj: "No autorizado", error: "Token no válido o faltante"});
    }

    next()
}