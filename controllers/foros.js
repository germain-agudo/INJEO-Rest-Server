const {response, request} = require('express');

const {Foro}= require('../models/index');

/**
 *  Obtener Todas Los Foros
 */
 const obtenerForos = async(req, res= response)=>{
    res.json({
        msg:'Obtener Foros'
    });    
    }

/**
 *  Obtener Un Foro
 */
const obtenerForo = async(req, res= response)=>{
res.json({
    msg:'Obtener Foro'
});    
}

/**
 *  Crear Un Foro
 */
const crearForo = async(req, res= response)=>{
res.json({
    msg:'Crear Foro'
});    
}

/**
 *  Actualizar Un Foro
 */
const actualizarForo = async(req, res= response)=>{
res.json({
    msg:'Actualizar Foro'
});    
}

/**
 *  Eliminar Un Foro
 */
const eliminarForo = async(req, res= response)=>{
res.json({
    msg:'Eliminar Foro'
});    
}




module.exports={
    obtenerForos,
    obtenerForo,
      crearForo,
 actualizarForo,
   eliminarForo,
}



