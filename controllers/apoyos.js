const {response, request} = require('express');

const {Apoyo}= require('../models/index');

/**
 *  Obtener Todas Los Apoyos
 */
 const obtenerApoyos = async(req, res= response)=>{
    res.json({
        msg:'Obtener Apoyos'
    });    
    }

/**
 *  Obtener Un Apoyo
 */
const obtenerApoyo = async(req, res= response)=>{
res.json({
    msg:'Obtener Apoyo'
});    
}

/**
 *  Crear Un Apoyo
 */
const crearApoyo = async(req, res= response)=>{
res.json({
    msg:'Crear Apoyo'
});    
}

/**
 *  Actualizar Un Apoyo
 */
const actualizarApoyo = async(req, res= response)=>{
res.json({
    msg:'Actualizar Apoyo'
});    
}

/**
 *  Eliminar Un Apoyo
 */
const eliminarApoyo = async(req, res= response)=>{
res.json({
    msg:'Eliminar Apoyo'
});    
}




module.exports={
        obtenerApoyos,
        obtenerApoyo,
        crearApoyo,
        actualizarApoyo,
        eliminarApoyo,
}



