const {response, request} = require('express');

const {PracticaP}= require('../models/index');

/**
 *  Obtener la lista de todos las practicas profesionales 
 */
 const obtenerPracticasProfesionales = async(req, res= response)=>{ 
    const {limite=50, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, practicasProfesionales] = await Promise.all([
        PracticaP.countDocuments(query),
        PracticaP.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        practicasProfesionales
    });    
    }

/**
 *  Obtener Una Practica Profesional 
 */
const obtenerPracticaProfesional = async(req, res= response)=>{
    const {id}= req.params;
    const practicaProfesional = await PracticaP.findById(id)
                    .populate('usuario_id',{password:0, __v:0});
res.json(practicaProfesional);    
}

/** 
 *  Crear Una Practica Profesional
 */
const crearPracticaProfesional = async(req, res= response)=>{

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
    
    const practicaProfesional = new PracticaP(data);
await practicaProfesional.save();      
    res.status(201).json(practicaProfesional);
}

/**
 *  Actualizar Una Practica Profesional
 */
const actualizarPracticaProfesional = async(req= request, res= response)=>{
  
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

const practicaPDB = await  PracticaP.findById(id);

let permiso = true;
(practicaPDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

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

const    practicaProfesional = await PracticaP.findByIdAndUpdate(id,data, {new:true});
res.json(practicaProfesional);    
}


/**
 *  Eliminar Una practica profesional 
 */
const eliminarPracticaProfesional = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const  practicaPDB = await  PracticaP.findById(id);
let permiso = true;
(  practicaPDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
const    practicaProfesional = await PracticaP.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(practicaProfesional);    
}




module.exports={
        obtenerPracticasProfesionales,
        obtenerPracticaProfesional,
        crearPracticaProfesional,
        actualizarPracticaProfesional,
        eliminarPracticaProfesional,
}



