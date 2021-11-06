const {response, request} = require('express');

const {CatGiro}= require('../models/index');

/**
 *  Obtener Todas Las Catgiro
 */
 const obtenerCatgiros = async(req, res= response)=>{ 
    const {limite=50, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, giros] = await Promise.all([
        CatGiro.countDocuments(query),
        CatGiro.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        giros
    });    
    }

/**
 *  Obtener Una Catgiro
 */
const obtenerCatgiro = async(req, res= response)=>{
    const {id}= req.params;
    const cataGiro = await CatGiro.findById(id)
                    .populate('usuario_id',{password:0, __v:0});
res.json(cataGiro);    
}

/** 
 *  Crear Una Catgiro
 */
const crearCatgiro = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {giro }= req.body;   

    const data = {

        giro:giro.toUpperCase().trim(),
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
    const catGiro = new CatGiro(data);
await catGiro.save();      
    res.status(201).json(catGiro);
}

/**
 *  Actualizar Una Catgiro
 */
const actualizarCatgiro = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {giro }= req.body;



const data = {
    giro:giro.toUpperCase().trim(),
}

const catGiro = await CatGiro.findByIdAndUpdate(id,data, {new:true});
res.json(catGiro);    
}

/**
 *  Eliminar Una Catgiro
 */
const eliminarCatgiro = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;

const catGiro = await CatGiro.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(catGiro);    
}




module.exports={
        obtenerCatgiros,
        obtenerCatgiro,
        crearCatgiro,
        actualizarCatgiro,
        eliminarCatgiro,
}



