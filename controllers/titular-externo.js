const {response, request} = require('express');

const { TitularExterno }= require('../models/index');

/**
 *  Obtener Todas Las TitularExternos
 */
 const obtenerTitularExternos = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, titulares] = await Promise.all([
        TitularExterno.countDocuments(query),
        TitularExterno.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        titulares
    });    
    }

/**
 *  Obtener Una TitularExterno
 */
const obtenerTitularExterno = async(req, res= response)=>{
    const {id}= req.params;
    const titular = await TitularExterno.findById(id)
                    .populate('usuario_id',{password:0, __v:0});
res.json(titular);    
}

/** 
 *  Crear Una TitularExterno
 */
const crearTitularExterno = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {

        nombre,
        apellidos,
        curp,
        ine_url,
        direccion,
        correo_electronico,
        numero_telefonico,
        curp_url

     }= req.body;   

    const data = {

        nombre : nombre.toUpperCase().trim(),
        apellidos : apellidos.toUpperCase().trim(),
        curp : curp.toUpperCase().trim(),
        ine_url : ine_url.trim(),
        direccion : direccion.trim(),
        correo_electronico : correo_electronico.trim(),
        numero_telefonico : numero_telefonico.trim(),
        usuario_id: req.usuario._id,
        fecha_registro,
        curp_url
    }
    
    const titular = new TitularExterno(data);
await titular.save();      
    res.status(201).json(titular);
}

/**
 *  Actualizar Una TitularExterno
 */
const actualizarTitularExterno = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {
    nombre,
    apellidos,
    curp,
    ine_url,
    direccion,
    correo_electronico,
    numero_telefonico,
    curp_url,
}= req.body;

const titularDB = await  TitularExterno.findById(id);

let permiso = true;
(titularDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const curpDB= await TitularExterno.findOne({curp:curp.toUpperCase().trim(), estado:true})

if (curpDB) {
    if (curpDB._id!=id) {
       return res.status(400).json({
           msg:`La CURP: '${curpDB.curp}', ya está registrada `,
               
           }); 
    }
}

const data = {
nombre :nombre.toUpperCase().trim(),
apellidos :apellidos.toUpperCase().trim(),
curp :curp.toUpperCase().trim(),
ine_url :ine_url.trim(),
direccion :direccion.trim(),
correo_electronico :correo_electronico.trim(),
numero_telefonico :numero_telefonico.trim(),
curp_url,
}





const titular = await TitularExterno.findByIdAndUpdate(id,data, {new:true});
res.json(titular);    
}

/**
 *  Eliminar Una TitularExterno
 */
const eliminarTitularExterno = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const titularDB = await  TitularExterno.findById(id);
let permiso = true;
(titularDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
const titular = await TitularExterno.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(titular);    
}




module.exports={
        obtenerTitularExternos,
        obtenerTitularExterno,
        crearTitularExterno,
        actualizarTitularExterno,
        eliminarTitularExterno,
}



