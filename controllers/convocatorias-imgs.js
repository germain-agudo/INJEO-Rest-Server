const {response, request} = require('express');

const {ConvocatoriaImg}= require('../models/index');

/**
 *  Obtener Todas Las Convocatorias Imagenes
 */
 const obtenerConvocatoriasImagenes = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, convocatoriasImgs] = await Promise.all([
        ConvocatoriaImg.countDocuments(query),
        ConvocatoriaImg.find(query)
                        .populate('convocatoria_id',['titulo'])
                        .populate('imagen_id',['img'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        convocatoriasImgs
    });    
    }

/**
 *  Obtener Una Convocatoria-Imagen
 */
const obtenerConvocatoriaImagen = async(req, res= response)=>{
    const {id}= req.params;
    const convocatoriaImg = await ConvocatoriaImg.findById(id)
                                                        .populate('convocatoria_id',['titulo'])
                                                        .populate('imagen_id',['img'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(convocatoriaImg);    
}

/** 
 *  Crear Una Convocatoria Imagen
 */
const crearConvocatoriaImg = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {convocatoria_id , imagen_id, }= req.body;   

    const data = {
        convocatoria_id,
        imagen_id,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const convocatoriaImg = new ConvocatoriaImg(data);
                   await convocatoriaImg.save();      
    res.status(201).json(convocatoriaImg);
}

/**
 *  Actualizar Una Convocatoria Imagen
 */
const actualizarConvocatoriaImg = async(req= request, res= response)=>{
  
const {id }= req.params;   
const { convocatoria_id,   imagen_id, }= req.body;

const convocatoriaImgDB = await  ConvocatoriaImg.findById(id);

let permiso = true;
(convocatoriaImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const data = {
    convocatoria_id, 
    imagen_id
}

   const convocatoriaImage = await ConvocatoriaImg.findByIdAndUpdate(id,data, {new:true});
res.json(convocatoriaImage);    
}

 
/**
 *  Eliminar Una Convocatoria Imagen
 */
const eliminarConvocatoriaImg = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const convocatoriaImgDB = await  ConvocatoriaImg.findById(id);
let permiso = true;
(convocatoriaImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const convocatoriaImage = await ConvocatoriaImg.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(convocatoriaImage);    
}




module.exports={
        obtenerConvocatoriasImagenes,
        obtenerConvocatoriaImagen,
        crearConvocatoriaImg,
        actualizarConvocatoriaImg,
        eliminarConvocatoriaImg,
}



