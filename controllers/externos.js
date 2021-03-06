const { response } = require('express');
const {  Externo, Usuario } = require('../models');


const obtenerExternos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, externos ] = await Promise.all([
        Externo.countDocuments(query),
        Externo.find(query)
            // .populate('usuario_id', 'user_name')
            // .populate('usuario_id',{password:0, __v:0})
            .populate(
            [ 
                {
                    path :'usuario_id',
                    select:{__v:false, password:false, }                       
                }, 
                {
                    path :'titularempresa_id',
                    select:{__v:false,}        
                    , populate:{
                        path :'usuario_id',
                        select:{__v:false, password:false}                       
                    }                 
                }, 
                {
                    path :'tipoNegocio_id',
                    select:{__v:false,} ,
                    populate:{
                        path :'usuario_id',
                        select:{__v:false, password:false}                       
                    }                        
                }, 
                {
                    path :'giro_id',
                    select:{__v:false, } ,
                    populate:{
                        path :'usuario_id',
                        select:{__v:false, password:false}                       
                    }                        
                }, 
            
            ] )
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        externos
    });
}

const obtenerExterno = async(req, res = response ) => {

    const { id } = req.params;
    const externo = await Externo.findById( id )
                            // .populate('usuario_id', 'user_name');
                        // .populate('usuario_id',{password:0, __v:0})
                        .populate(
                            [ 
                                {
                                    path :'usuario_id',
                                    select:{__v:false, password:false, }                       
                                }, 
                                {
                                    path :'titularempresa_id',
                                    select:{__v:false,}        
                                    , populate:{
                                        path :'usuario_id',
                                        select:{__v:false, password:false}                       
                                    }                 
                                }, 
                                {
                                    path :'tipoNegocio_id',
                                    select:{__v:false,} ,
                                    populate:{
                                        path :'usuario_id',
                                        select:{__v:false, password:false}                       
                                    }                        
                                }, 
                                {
                                    path :'giro_id',
                                    select:{__v:false, } ,
                                    populate:{
                                        path :'usuario_id',
                                        select:{__v:false, password:false}                       
                                    }                        
                                }, 
                            
                            ] )

    res.json( externo );

}

const crearExterno = async(req, res = response ) => {
 // console.log(req.body );
 const fecha_registro = Date.now();
 
 let convenio=null;
 const {  

    nombre, 
     rfc, 
     direccion, 

     usuario_id,
     tipoNegocio_id,
     giro_id,
     titularempresa_id,
     pagina_web,
     latitud,
     longitud,
     comprobante_domicilio_pdf
     

     

} = req.body;

if (req.body.convenio) {
    convenio= req.body.convenio
}
if(usuario_id==null){
    return res.status(400).json({
        msg:'Usuario Invalido'
    })
}

 /*    const externoDB= await Externo.findOne({rfc, estado:true});

    if (externoDB) {
        return res.status(400).json({
            msg: `??Lo sentimos! el RFC '${ externoDB.rfc }', ya existe`
        });
    } */

const user_name = `${nombre}`.toUpperCase();
const usuario = await Usuario.findByIdAndUpdate(
    usuario_id,{
        user_name
        , datos_completos:true
    
    },{new:true})




const externo = new Externo({ 
    nombre : nombre.toUpperCase().trim(),
    rfc : rfc.toUpperCase().trim(), 
    direccion,  
    pagina_web,
    longitud, 
    latitud,
    titularempresa_id,
    tipoNegocio_id,
    giro_id,
    fecha_registro,
    usuario_id,
    comprobante_domicilio_pdf,
    convenio

   });


// // Encriptar la contrase??a
/* const salt = bcryptjs.genSaltSync();
usuario.password = bcryptjs.hashSync( password, salt ); */

// // Guardar en BD
await externo.save();
    
res.json({
    externo,

});

}

const actualizarExterno = async( req, res = response ) => {

    const { id } = req.params;
    const { 
         nombre
        ,rfc
        ,direccion
        ,pagina_web,
        longitud, 
        latitud,
        titularempresa_id,
        tipoNegocio_id,
        giro_id,
        comprobante_domicilio_pdf
    } = req.body;

    const [externoRegistrado , rfcDB] = await Promise.all([
        Externo.findById(id),
        Externo.findOne({rfc, estado:true})
    ]);

    // console.log(externoRegistrado);

    let permiso = true;
    (externoRegistrado.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }
  
    if (rfcDB) {
        if (rfcDB._id!=id) {
           return res.status(400).json({
               msg:`El RFC : '${curpDB.rfc}', ya est?? registrado `.toUpperCase(),
                   
               }); 
        }
    }    

    let convenio = null;
    if (req.body.convenio) {
        convenio= req.body.convenio
    }
    const externoDB = {    
        nombre : nombre.toUpperCase().trim(),
    rfc : rfc.toUpperCase().trim(), 
    direccion,  
    pagina_web,
    longitud, 
    latitud,
    titularempresa_id,
    tipoNegocio_id,
    giro_id,
    comprobante_domicilio_pdf,
    convenio
    };   

    const externo = await Externo.findByIdAndUpdate( id, externoDB,{new:true});
    res.json(externo);





}


const borrarExterno = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();

    const { id } = req.params;

    const externoRegistrado = await Externo.findById(id);
    let permiso = true;
    (externoRegistrado.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }




    const externoBorrado = await Externo.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true });

    res.json( externoBorrado );
}






module.exports = {
    crearExterno,
    
    borrarExterno,
    actualizarExterno,
    obtenerExterno,
    obtenerExternos
    // obtenerNoticias,
    // obtenerNoticia,
    // actualizarNoticia,
    // borrarNoticia,
}