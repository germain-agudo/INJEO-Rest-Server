const {response, request} = require('express');

const {Producto}= require('../models/index');

/**
 *  Obtener Todas 
 */
 const obtenerProductos = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        .populate(
                            [
                                {
                                    path: 'empresa_id',
                                    select:{__v:false, password: false},
                                    // populate:{
                                    //     path :'usuario_id',
                                    //     select:{__v:false, password:false}                       
                                    // }           
                                }
                                ,{
                                    path: 'categoria_id',
                                    select:{__v:false},
                                    populate:{
                                        path :'usuario_id',
                                        select:{__v:false, password:false}                       
                                    }           
                                }


                            ]
                        )



                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        productos
    });    
    }

/**
 *  Obtener Un
 */
const obtenerProducto = async(req, res= response)=>{
    const {id}= req.params;
    const producto = await Producto.findById(id)
                    .populate('usuario_id',{password:0, __v:0})
                    .populate(
                        [
                            {
                                path: 'empresa_id',
                                select:{__v:false, password:false},
                                // populate:{
                                //     path :'usuario_id',
                                //     select:{__v:false, password:false}                       
                                // }           
                            }
                            ,{
                                path: 'categoria_id',
                                select:{__v:false},
                                populate:{
                                    path :'usuario_id',
                                    select:{__v:false, password:false}                       
                                }           
                            }


                        ]
                    )
                    
                    ;
res.json(producto);    
}

/** 
 *  Crear Uno
 */
const crearProducto = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {
        empresa_id,
        categoria_id,
        nombre,
        precio_original,
        descuento,
        fecha_inicio,
        fecha_fin 
    }= req.body;   

const porcentaje = (precio_original * descuento)/100;
const precio_final= precio_original-porcentaje;

    const data = {

empresa_id : empresa_id,
categoria_id : categoria_id,
nombre : nombre.toUpperCase().trim(),
precio_original : precio_original.trim().toString(),
descuento : descuento.trim(),
precio_final,
fecha_inicio : fecha_inicio.trim(),
fecha_fin : fecha_fin.trim(),
usuario_id: req.usuario._id,
fecha_registro
    }
    
    const producto = new Producto(data);
await producto.save();      
    res.status(201).json(producto);
}

/**
 *  Actualizar Uno
 */
const actualizarProducto = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {

    categoria_id,
    nombre,
    precio_original,
    descuento,
    fecha_inicio,
    fecha_fin 
}= req.body;

const porcentaje = (precio_original * descuento)/100;
const precio_final= precio_original-porcentaje;


const productoDB = await  Producto.findById(id);

let permiso = true;
(productoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const data = {
    categoria_id,
    nombre : nombre.trim(),
    precio_original : precio_original.trim(),
    descuento : descuento.trim(),
    precio_final,
    fecha_inicio : fecha_inicio.trim(),
    fecha_fin : fecha_fin.trim() 
}

const producto = await Producto.findByIdAndUpdate(id,data, {new:true});
res.json(producto);    
}

/**
 *  Eliminar Uno
 */
const eliminarProducto = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const productoDB = await  Producto.findById(id);
let permiso = true;
(productoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const producto = await Producto.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(producto);    
}




module.exports={
        obtenerProductos,
        obtenerProducto,
        crearProducto,
        actualizarProducto,
        eliminarProducto,
}



