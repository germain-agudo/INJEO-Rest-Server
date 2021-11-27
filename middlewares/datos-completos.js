const { response } = require('express')
const {Persona, Externo} = require('../models/index')

const datosCompletos = async( req, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }
    const {  _id} = req.usuario;

    const [personaRegistrada , externoRegistrado] = await Promise.all([
        Persona.findOne({usuario_id:_id , estado:true}),
        Externo.findOne({usuario_id:_id , estado:true})        
    ]);


let dependencia;    
    
    if (!personaRegistrada && !externoRegistrado) {
       
        return res.status(401).json({
            msg: `El usuario: '${ _id }' no existe en los usuarios  - No puede hacer esto`
        });
    }


if (!req.usuario.datos_completos) {
           
    return res.status(401).json({
        msg: `El usuario: '${ _id }' no ha completado su registro  - No puede hacer esto`
    });
}

if (!req.usuario.aceptacion_completa) {
           
    return res.status(401).json({
        msg: `El usuario: '${ _id }' ha completado su registro, pero aún no ha sido aceptado - por favor espere su verificación `
    });
}

    next();
}



module.exports = {
    // manipulacionValida,
    datosCompletos,
    
 
}