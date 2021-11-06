const {response, request} = require('express');

const {CatTipoN}= require('../models/index');

/**
 *  Obtener Todas
 */
 const obtenerCatTipoNegocios = async(req, res= response)=>{ 
    const {limite=50, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, tipos_negocio] = await Promise.all([
        CatTipoN.countDocuments(query),
        CatTipoN.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        tipos_negocio
    });    
    }

/**
 *  Obtener
 */
const obtenerCatTipoNegocio = async(req, res= response)=>{
    const {id}= req.params;
    const cataTipoNegocio = await CatTipoN.findById(id)
                    .populate('usuario_id',{password:0, __v:0});
res.json(cataTipoNegocio);    
}

/** 
 *  Crear
 */
const crearCatTipoNegocio = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {tipo }= req.body;   

    const data = {

        tipo:tipo.toUpperCase().trim(),
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
    const catTipoNegocio = new CatTipoN(data);
await catTipoNegocio.save();      
    res.status(201).json(catTipoNegocio);
}

/**
 *  Actualizar 
 */
const actualizarCatTipoNegocio = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {tipo }= req.body;



const data = {
    tipo:tipo.toUpperCase().trim(),
}

const catTipoNegocio = await CatTipoN.findByIdAndUpdate(id,data, {new:true});
res.json(catTipoNegocio);    
}

/**
 *  Eliminar 
 */
const eliminarCatTipoNegocio = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;

const catTipoNegocio = await CatTipoN.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(catTipoNegocio);    
}




module.exports={
        obtenerCatTipoNegocios,
        obtenerCatTipoNegocio,
        crearCatTipoNegocio,
        actualizarCatTipoNegocio,
        eliminarCatTipoNegocio,
}



