const {response, request} = require('express');

const {Beca}= require('../models/index');

/**
 *  Obtener Todas Las Becas
 */
 const obtenerBecas = async(req, res= response)=>{
    res.json({
        msg:'Obtener Becas'
    });    
    }

/**
 *  Obtener Una Beca
 */
const obtenerBeca = async(req, res= response)=>{
res.json({
    msg:'Obtener Beca'
});    
}

/**
 *  Crear Una Beca
 */
const crearBeca = async(req, res= response)=>{
res.json({
    msg:'Crear Beca'
});    
}

/**
 *  Actualizar Una Beca
 */
const actualizarBeca = async(req, res= response)=>{
res.json({
    msg:'Actualizar beca'
});    
}

/**
 *  Eliminar Una Beca
 */
const eliminarBeca = async(req, res= response)=>{
res.json({
    msg:'Eliminar Beca'
});    
}




module.exports={
        obtenerBecas,
        obtenerBeca,
        crearBeca,
        actualizarBeca,
        eliminarBeca,
}



