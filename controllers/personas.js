const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const {Persona, Usuario} = require('../models/index');
// const usuario = require('../models/usuario');

const obtenerPersona = async(req, res = response ) => {

    const { id } = req.params;
    const persona = await Persona.findById( id )
                         .populate('usuario_id',['user_name'])
    ;
                            

    res.json( persona );

}
 
 
const personasGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 , estado=true} = req.query;
    const query = { estado};

    const [ total, personas ] = await Promise.all([
        Persona.countDocuments(query),
        Persona.find(query)
            .populate('usuario_id',['user_name'])
            .skip( Number( desde ) )
            .limit(Number( limite ))
            
    ]);

    res.json({
        total,
        personas
    });
}



const personaPost = async(req, res = response) => {
    // console.log(req.body );
    // const fecha_registro = Date.now();

 const fecha_registro = Date.now();



const {
nombre
, apellido_paterno
,apellido_materno
,edad
,sexo
,curp
,fecha_nacimiento
,municipio
,region
,usuario_id

} = req.body;

const user_name = `${nombre} ${apellido_paterno} ${apellido_materno}`.toUpperCase();


const usuario = await Usuario.findByIdAndUpdate(usuario_id,{user_name, datos_completos:true},{new:true})
/* 
const usuarioDB = await usuario.findById(usuario_id);

if (!usuarioDB.estado) {
    
} */
 
    const persona = new Persona({            
 nombre       
,apellido_paterno
,apellido_materno
,edad
,sexo
,curp
,fecha_nacimiento
,municipio
,region
,usuario_id
,fecha_registro
    
    });


    // // Guardar en BD
await persona.save();
        
res.json({
        persona,
        // usuario
       
    });
}







const personaPut = async(req, res = response) => {
    // const fecha_registro = Date.now();
    const { id } = req.params;  
    const {
        nombre
        , apellido_paterno
        ,apellido_materno
        ,edad
        ,sexo
        ,curp
        ,fecha_nacimiento
        ,municipio
        ,region 

      
        } = req.body;
        
const [personaRegistrada , curpDB] = await Promise.all([
    Persona.findById(id),
    Persona.findOne({curp, estado:true})
]);
//    const curpDB= await Persona.findOne({curp, estado:true})


let permiso = true;
(personaRegistrada.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}


 if (curpDB) {
     if (curpDB._id!=id) {
        return res.status(400).json({
            msg:`La CURP : '${curpDB.correo}', ya está registrada `.toUpperCase(),
                
            }); 
     }
 }

    const personaDB = {    
        nombre
        , apellido_paterno
        ,apellido_materno
        ,edad
        ,sexo
        ,curp
        ,fecha_nacimiento
        ,municipio
        ,region 
  
           
    };   

    // const usuario = await Usuario.findByIdAndUpdate( id, resto );
    const persona = await Persona.findByIdAndUpdate( id, personaDB,{new:true});
    res.json(persona);
}


 


const personaDelete = async(req, res = response) => {
    const fecha_eliminacion = Date.now();

    const { id } = req.params;

const personaRegistrada = await Persona.findById(id);
let permiso = true;
(personaRegistrada.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}    
const persona = await Persona.findByIdAndUpdate( id, { estado: false ,fecha_eliminacion} );

    res.json(persona);
}




module.exports = {
personaPost,
personaPut,
personaDelete,
personasGet,
obtenerPersona,
}