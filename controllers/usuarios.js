const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const {Usuario, Externo, Persona , UsuarioForo }= require('../models/index');

const obtenerUsuario = async(req, res = response ) => {

    const { id } = req.params;
    const usuario = await Usuario.findById( id );
                            

    res.json( usuario );

}
 

const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
            .sort({fecha_registro:1})
    ]);

    res.json({
        total,
        usuarios
    });
}




const usuariosPost = async(req, res = response) => {
    // console.log(req.body );
 const fecha_registro = Date.now();
    const { 
        numero_telefonico,  
         correo, password, rol,     
    } = req.body;

 




    const usuario = new Usuario({    
         correo, password, rol,numero_telefonico, fecha_registro, });

    // // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // // Guardar en BD
    await usuario.save();
        
    res.json({
        usuario
       
    });
}


const usuariosPut = async(req, res = response) => {

    



    const fecha_registro = Date.now();

    const { id } = req.params;
    
    const { numero_telefonico,  
        correo, password, rol,    
   } = req.body;

   const correoDB= await Usuario.findOne({correo, estado:true})

 if (correoDB) {
     if (correoDB._id!=id) {
        return res.status(400).json({
            msg:`El correo: '${correoDB.correo}', ya está registrado `.toUpperCase(),
                
            }); 
     }
 }




/*     // const { _id, password,  correo,  ...resto } = req.body;


    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    } */

    let usuarioDB;
if (req.usuario.rol==='ADMIN_ROLE') {
    // console.log('es igual');    
    usuarioDB = {    
        correo, password, rol,numero_telefonico, fecha_registro, };
    // console.log(req.usuario.rol);
}else{
    // console.log('no es igual');
     usuarioDB = {    
        correo, password,numero_telefonico, fecha_registro, };  
}



   // // Encriptar la contraseña
   const salt = bcryptjs.genSaltSync();
   usuarioDB.password = bcryptjs.hashSync( password, salt );




    // const usuario = await Usuario.findByIdAndUpdate( id, resto );

    const usuario = await Usuario.findByIdAndUpdate( id, usuarioDB,{new:true});

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );




    const [personaRegistrada , externoRegistrado] = await Promise.all([
        Persona.findOne({usuario_id:id , estado:true}),
        Externo.findOne({usuario_id:id , estado:true})        
    ]);

const usuario = await Usuario.findByIdAndUpdate( id, { estado: false },{new:true} );

let dependencia;    
if (personaRegistrada) {
    // console.log('existe en persona');
    dependencia= await Persona.findByIdAndUpdate(personaRegistrada._id,{estado:false},{new:true})
}
if (externoRegistrado) {
    dependencia = await Externo.findByIdAndUpdate(externoRegistrado._id,{estado:false},{new:true})    
    // console.log('existe en externo');
}

const [usuariosForos]= await Promise.all([
    UsuarioForo.find({
        usuario_id:id, estado:true
    }).then( (uF)=>{
            if (uF.length>0) {
                uF.forEach(async (i)=>{
                    await UsuarioForo.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true});
                })
            }
    })
])



    res.json({usuario, dependencia});
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    obtenerUsuario
}