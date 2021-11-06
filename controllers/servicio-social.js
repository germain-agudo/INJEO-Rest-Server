const {response, request} = require('express');

const {ServicioS}= require('../models/index');

/**
 *  Obtener la lista de todos los servicios sociales 
 */
 const obtenerServiciosSociales = async(req, res= response)=>{ 
    const {limite=50, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, serviciosSociales] = await Promise.all([
        ServicioS.countDocuments(query),
        ServicioS.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        serviciosSociales
    });    
    }

/**
 *  Obtener Un servicio social 
 */
const obtenerServicioSocial = async(req, res= response)=>{
    const {id}= req.params;
    const servicioSocial = await ServicioS.findById(id)
                    .populate('usuario_id',{password:0, __v:0});
res.json(servicioSocial);    
}

/** 
 *  Crear Un Servicio Social
 */
const crearServicioSocial = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {
        nombre_programa, 
        dependencia, 
        perfil, 
        descripcion, 
        nombre_responsable, 
        correo_responsable,
        telefono_responsable
    
    }= req.body;   

    const data = {
        nombre_programa:nombre_programa.toUpperCase().trim(),
        dependencia : dependencia.trim(), 
        perfil : perfil.trim(), 
        descripcion : descripcion.trim(), 
        nombre_responsable : nombre_responsable.trim(), 
        correo_responsable : correo_responsable.trim(),
        telefono_responsable : telefono_responsable.trim(),
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
    const servicioSocial = new ServicioS(data);
await servicioSocial.save();      
    res.status(201).json(servicioSocial);
}

/**
 *  Actualizar Un Servicio Social
 */
const actualizarServicioSocial = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {        
    nombre_programa, 
    dependencia, 
    perfil, 
    descripcion, 
    nombre_responsable, 
    correo_responsable,
    telefono_responsable
 }= req.body;

const servicioSDB = await  ServicioS.findById(id);

let permiso = true;
(servicioSDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const data = {
nombre_programa :        nombre_programa.toUpperCase().trim(), 
dependencia :            dependencia.trim(), 
perfil :                 perfil.trim(), 
descripcion :            descripcion.trim(), 
nombre_responsable :     nombre_responsable.trim(), 
correo_responsable :     correo_responsable.trim(),
telefono_responsable :   telefono_responsable.trim() 
}

const    servicoSocial = await ServicioS.findByIdAndUpdate(id,data, {new:true});
res.json(servicoSocial);    
}


/**
 *  Eliminar Un Servicio social 
 */
const eliminarServicioSocial = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const servicioSDB = await  ServicioS.findById(id);
let permiso = true;
(servicioSDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
const    servicioSocial = await ServicioS.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(servicioSocial);    
}




module.exports={
        obtenerServiciosSociales,
        obtenerServicioSocial,
        crearServicioSocial,
        actualizarServicioSocial,
        eliminarServicioSocial,
}



