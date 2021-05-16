const {response, request} = require('express');

const {BolsaTrabajo}= require('../models/index');

/**
 *  Obtener Todas Las Bolsa De Trabajo
 */
 const obtenerBolsas = async(req, res= response)=>{
    res.json({
        msg:'Obtener Bolsas de Trabajo'
    });    
    }

/**
 *  Obtener Una Bolsa De Trabajo
 */
const obtenerBolsa = async(req, res= response)=>{
res.json({
    msg:'Obtener Bolsa de Trabajo'
});    
}

/**
 *  Crear Una Bolsa de Trabajo
 */
const crearBolsa = async(req, res= response)=>{
res.json({
    msg:'Crear Bolsa de Trabajo'
});    
}

/**
 *  Actualizar Una Bolsa de Trabajo
 */
const actualizarBolsa = async(req, res= response)=>{
res.json({
    msg:'Actualizar Bolsa de Trabajo'
});    
}

/**
 *  Eliminar Una Bolsa de Trabajo
 */
const eliminarBolsa = async(req, res= response)=>{
res.json({
    msg:'Eliminar Bolsa de Trabajo'
});    
}




module.exports={
    obtenerBolsa,
    obtenerBolsas,
    crearBolsa,
    actualizarBolsa,
    eliminarBolsa,
}



