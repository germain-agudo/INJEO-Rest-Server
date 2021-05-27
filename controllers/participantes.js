const {response, request} = require('express');

const { Participante}= require('../models/index');

/**
 *  Obtener Todos Los Participantes
 */
 const obtenerParticipantes = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, participantes] = await Promise.all([
        Participante.countDocuments(query),
        Participante.find(query)
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        participantes
    });    
    }

/**
 *  Obtener Un Participante
 */
const obtenerParticipante = async(req, res= response)=>{
    const {id}= req.params;
    const participante = await Participante.findById(id)
                                        .populate('usuario_id',['user_name']);
res.json(participante);    
}

/** 
 *  Crear Un Participante
 */
const crearParticipante = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {nombre,descripcion, }= req.body;   

    const data = {

        nombre:nombre.toUpperCase(),
        descripcion,
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
               const participante = new Participante(data);
               await participante.save();      
res.status(201).json(participante);
}

/**
 *  Actualizar Un Participante
 */
const actualizarParticipante = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {nombre,descripcion, }= req.body;

const participanteDB = await  Participante.findById(id);

let permiso = true;
(participanteDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const data = {
    nombre:nombre.toUpperCase(),
    descripcion,

}

   const participante = await Participante.findByIdAndUpdate(id,data, {new:true});
res.json(participante);    
}

/**
 *  Eliminar Un Participante
 */
const eliminarParticipante = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const participanteDB = await  Participante.findById(id);
let permiso = true;
(participanteDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const participante = await Participante.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(participante);    
}




module.exports={
         obtenerParticipantes,
         obtenerParticipante,
             crearParticipante,
        actualizarParticipante,
          eliminarParticipante,
}



