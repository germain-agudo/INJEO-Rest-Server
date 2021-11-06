const {response, request} = require('express');


const {ProductoImg, Producto , Image}= require('../models/index');

/**
 *  Obtener Todas Los Productos Imagenes
 */
 const obtenerProductosImagenes = async(req, res= response)=>{ 
    const {limite=100, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, productosImgs] = await Promise.all([
        ProductoImg.countDocuments(query),
        ProductoImg.find(query)
                        .populate('producto_id',['nombre'])
                        .populate('imagen_id',['img'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        productosImgs
    });    
    }

/**
 *  Obtener Un Producto-Imagen
 */
const obtenerProductoImagen = async(req, res= response)=>{
    const {id}= req.params;
    const productoImg = await ProductoImg.findById(id)
                                                        .populate('producto_id',['nombre'])
                                                        .populate('imagen_id',['img'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(productoImg);    
}

/** 
 *  Crear Un Producto - Imagen
 */
const crearProductoImg = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {producto_id , imagen_id, }= req.body;   

const productoImageDB = await ProductoImg.findOne({producto_id, imagen_id, estado:true});
  if (productoImageDB) {
    return res.status(401).json({
        msg: `La imagen ${imagen_id} ya se encuentra registrada en el producto${producto_id}- No puede hacer esto`
    }); 
}



    const data = {
        producto_id,
        imagen_id,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const productoImg = new ProductoImg(data);
                   await productoImg.save();      
    res.status(201).json(productoImg);
}

/**
 *  Actualizar Un Producto - Imagen
 */
const actualizarProductoImg = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {   imagen_id, }= req.body;



// const noticiaImgDB = await  NoticiaImg.findById(id);
const [productoImgDB, productoImagenDuplicadaDB ] = await Promise.all([
    ProductoImg.findById(id),
    ProductoImg.findOne({ imagen_id, estado:true})
])



let permiso = true;
(productoImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

// const noticiaImagenDuplicadaDB = await ConvocatoriaImg.findOne({convocatoria_id, imagen_id, estado:true});


  if (productoImagenDuplicadaDB && productoImagenDuplicadaDB._id != id) {
    return res.status(401).json({
        msg: `La imagen ${imagen_id} ya se encuentra registrada en el producto: ${productoImagenDuplicadaDB.producto_id}- No puede hacer esto`
    }); 
}





const data = {
    // producto_id, 
    imagen_id
}

   const productoImage = await ProductoImg.findByIdAndUpdate(id,data, {new:true});
res.json(productoImage);    
}

 
/**
 *  Eliminar Un Producto - Imagen
 */
const eliminarProductoImg = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const productoImgDB = await  ProductoImg.findById(id);

let permiso = true;
(productoImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const productoImage = await ProductoImg.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(productoImage);    
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'productos':
               buscarImagenesPorProducto(id, res);
            break;
    
        case 'imagenes':
               buscarProductosPorImagen(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarImagenesPorProducto=async(id= '', res= response)=>{
    
    const query={estado:true, producto_id:id};
        const [producto,total,imagenes]= await Promise.all( [
                Producto.findById(id),
                ProductoImg.countDocuments(query),
                ProductoImg.find({estado:true, producto_id:id}, {imagen_id:1,})     
                                    // .populate('imagen_id',['img'])                                
                                    .populate({
                                        path: 'imagen_id',
                                        select:{__v:false, },
                                        populate:{
                                            path: 'usuario_id',
                                            select:{__v:false, password: false },
                                        }
                                    })                                
            ]);
    
            if (!producto || !producto.estado) {
                return   res.status(401).json({
                msg: `El Producto: ${id}, no existe`
                });        
            }
    
        return res.json({
            'producto': producto.nombre,
            total,
            // results:(carreras) ? [carreras] :[],
            results:imagenes,
        });    
    }
    
    const buscarProductosPorImagen=async(id= '', res= response)=>{
    
    const query={estado:true, imagen_id:id};
    
        const [imagen,total,productos]= await Promise.all( [
                Image.findById(id),
                ProductoImg.countDocuments(query),
                ProductoImg.find({estado:true, imagen_id:id}, {producto_id:1,})     
                                    .populate('producto_id',['titulo'])                                
            ]);
    
            if (!imagen || !imagen.estado) {
                return  res.status(401).json({
                msg: `La imagen ${id}, no existe`
                });        
            }
    
        return res.json({
            'Imagen': imagen._id,
            total,
            results:productos,
        });    
    }
    
    
    






module.exports={
        obtenerProductosImagenes,
        obtenerProductoImagen,
          crearProductoImg,
     actualizarProductoImg,
       eliminarProductoImg,
        buscarRelacion
}



