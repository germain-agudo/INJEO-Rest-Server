const {response, request} = require('express');

const {CatCategoriaP}= require('../models/index');

/**
 *  Obtener Todas
 */
 const obtenerCatCategoriaProductos = async(req, res= response)=>{ 
    const {limite=50, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, categorias_productos] = await Promise.all([
        CatCategoriaP.countDocuments(query),
        CatCategoriaP.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        categorias_productos
    });    
    }

/**
 *  Obtener
 */
const obtenerCatCategoriaProducto = async(req, res= response)=>{
    const {id}= req.params;
    const catCategoriaProductos = await CatCategoriaP.findById(id)
                    .populate('usuario_id',{password:0, __v:0});
res.json(catCategoriaProductos);    
}

/** 
 *  Crear
 */
const crearCatCategoriaProducto = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {categoria }= req.body;   

    const data = {

        categoria:categoria.toUpperCase().trim(),
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
    const catcategoriaProducto = new CatCategoriaP(data);
await catcategoriaProducto.save();      
    res.status(201).json(catcategoriaProducto);
}

/**
 *  Actualizar 
 */
const actualizarCatCategoriaProducto = async(req= request, res= response)=>{
  
const {id }= req.params;   
const { categoria }= req.body;



const data = {
    categoria:categoria.toUpperCase().trim(),
}

const catCategoriaProducto = await CatCategoriaP.findByIdAndUpdate(id,data, {new:true});
res.json(catCategoriaProducto);    
}

/**
 *  Eliminar 
 */
const eliminarCatCategoriaProducto = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;

const catCategoriaProducto = await CatCategoriaP.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(catCategoriaProducto);    
}




module.exports={
        obtenerCatCategoriaProductos,
        obtenerCatCategoriaProducto,
        crearCatCategoriaProducto,
        actualizarCatCategoriaProducto,
        eliminarCatCategoriaProducto,
}



