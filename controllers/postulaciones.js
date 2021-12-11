const {response, request} = require('express');

const {Postulacion, BolsaTrabajo, Usuario, Persona}= require('../models/index');
const {ObjectId}= require('mongoose').Types;

/**
 *  Obtener Todas
 */
 const obtenerPostulaciones = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, postulacion] = await Promise.all([
        Postulacion.countDocuments(query),
        Postulacion.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuariojoven_id',{password:0, __v:0})
                        .populate(
                            {
                                path: 'bolsa_id',
                                select:{__v:false, },
                                populate:[
                                    {
                                        path: 'usuario_id',
                                        select:{__v:false, password: false },
                                    },
                                    {
                                        path: 'categoriabolsa_id',
                                        select:{__v:false,  },
                                        populate:{
                                            path :'usuario_id',
                                            select:{__v:false, password:false, } 
                                        }
                                    },
                                    {
                                        path: 'estado_id',
                                        select:{__v:false,  },
                                        populate:{
                                            path :'usuario_id',
                                            select:{__v:false, password:false, } 
                                        }
                                    },
                                    {
                                        path: 'municipio_id',
                                        select:{__v:false, },
                                        populate:
                                             [      
                                            {
                                            path: 'usuario_id',
                                            select:{__v:false, password: false},
                                            },
                                            {
                                            path: 'estado_id',
                                            select:{__v:false},
                                            populate:{
                                                path :'usuario_id',
                                                select:{__v:false, password:false}                       
                                            }           
                                                    }
                                    ]
                                    },
                                    {
                                        path: 'externo_id',
                                        select:{__v:false, },
                                        populate:
                                       [ 
                                        {
                                            path :'usuario_id',
                                            select:{__v:false, password:false, }                       
                                        }, 
                                        {
                                            path :'titularempresa_id',
                                            select:{__v:false,}        
                                            ,                        populate:{
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
                                    
                                    ],          
                                }
                                ]
                            },
                        )
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        postulacion
    });    
    }

/**
 *  Obtener Un
 */
const obtenerPostulacion = async(req, res= response)=>{
    const {id}= req.params;
    const postulacion = await Postulacion.findById(id)
                    // .populate('usuario_id',{password:0, __v:0});
                    
                    .populate('usuariojoven_id',{password:0, __v:0})
                    .populate(
                        {
                            path: 'bolsa_id',
                            select:{__v:false, },
                            populate:[
                                {
                                    path: 'usuario_id',
                                    select:{__v:false, password: false },
                                },
                                {
                                    path: 'categoriabolsa_id',
                                    select:{__v:false,  },
                                    populate:{
                                        path :'usuario_id',
                                        select:{__v:false, password:false, } 
                                    }
                                },
                                {
                                    path: 'estado_id',
                                    select:{__v:false,  },
                                    populate:{
                                        path :'usuario_id',
                                        select:{__v:false, password:false, } 
                                    }
                                },
                                {
                                    path: 'municipio_id',
                                    select:{__v:false, },
                                    populate:
                                         [      
                                        {
                                        path: 'usuario_id',
                                        select:{__v:false, password: false},
                                        },
                                        {
                                        path: 'estado_id',
                                        select:{__v:false},
                                        populate:{
                                            path :'usuario_id',
                                            select:{__v:false, password:false}                       
                                        }           
                                                }
                                ]
                                },
                                {
                                    path: 'externo_id',
                                    select:{__v:false, },
                                    populate:
                                   [ 
                                    {
                                        path :'usuario_id',
                                        select:{__v:false, password:false, }                       
                                    }, 
                                    {
                                        path :'titularempresa_id',
                                        select:{__v:false,}        
                                        ,                        populate:{
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
                                
                                ],          
                            }
                            ]
                        },
                    )
res.json(postulacion);    
}

/** 
 *  Crear Uno
 */
const crearPostulacion = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const { bolsa_id }= req.body;   

// const postulacionDB = await Postulacion.findOne({ bolsa_id, usuariojoven_id: req.usuario._id, estado:true})
// .populate('usuariojoven_id',{password:0, __v:0});


const [ postulacionDB, persona ] = await Promise.all([
    Postulacion.findOne({ bolsa_id, usuariojoven_id: req.usuario._id, estado:true}),
    Persona.findOne({usuario_id: req.usuario._id, estado: true})
        // .populate('usuario_id',['user_name'])
]);




if (!persona) {
    return res.status(401).json({
        msg: `Actualmente no existe un joven con el usuario ${req.usuario._id}`
    }); 
}

if (!persona.curriculum_url) {
    return res.status(401).json({
        msg: `Actualmente el usuario ${req.usuario._id}, no cuenta con un Curriculum vita, revise sus datos`
    }); 
}

const curriculum_url = persona.curriculum_url;


if (postulacionDB) {
    return res.status(401).json({
        msg: `Actualmente el usuario ${req.usuario._id}, ya está postulado en la oferta:${bolsa_id} `
    }); 
}
    const data = {
        curriculum_url,
        bolsa_id,
        usuariojoven_id: req.usuario._id,
        fecha_registro
    }
    
    const postulacion = new Postulacion(data);
    await postulacion.save();      
    res.status(201).json( postulacion );
}

/**
 *  Actualizar Una
 */

 const actualizarPostulacion = async (req, res = response) => {
    const {   id , coleccion } = req.params;
    const {   msg } = req.body;
   
    // const postulacionDB = await  Postulacion.findById(id);

    // let permiso = true;
    // (postulacionDB.usuariojoven_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    // if (!permiso ) {    
    //     return res.status(401).json({
    //         msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    //     }); 
    // }
// console.log(curriculum_url);

let estausPostulacion;
switch (coleccion) {
    case 'aceptar':
         estausPostulacion = 2
        break;

    case 'rechazar':
        estausPostulacion = 3

        break;

    default:
       return res.status(500).json({ msg: 'Coloección en desarollo'});

        
} 


    const postulacion_db = await Postulacion.findByIdAndUpdate(id, {estatus: estausPostulacion, msg:msg.trim()}, {
        new: true
    });



    res.json(postulacion_db);

}

/**
 *  Eliminar Una 
 */
const eliminarPostulacion = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const postulacionDB = await  Postulacion.findById(id);
let permiso = true;
(postulacionDB.usuariojoven_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const postulacion = await Postulacion.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(postulacion);    
}




const buscarRelacion = async(req, res =response ) => {
    const {id, coleccion }= req.params;

    const {  bolsa = '', estatus='' }= req.query;

    switch (coleccion) {
        case 'bolsas':
               buscarPostuladosPorBolsa(id, res, estatus);
             
            break;
    
        case 'postulados':
               buscarBolsasPorPostulados(id,res, estatus);
            break;
        case 'postulacion-usuario':
               buscarExistenciaPostulacion(id,res, bolsa);
            break;
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    



    const buscarPostuladosPorBolsa=async(id= '', res= response, estatus ='todos')=>{
    
    let query;


switch (estatus) {
    case 'pendientes':
        query={estado:true, bolsa_id :id, estatus:1};
        
        break;
    case 'aceptadas':
        query={estado:true, bolsa_id :id, estatus:2};
        
        break;
    case 'rechazadas':
        query={estado:true, bolsa_id :id, estatus:3};
        
        break;

    default:
        query={estado:true, bolsa_id :id};

        break;
}





        const [bolsa_trabajo,total, postulados]= await Promise.all( [
                BolsaTrabajo.findById(id),
                Postulacion.countDocuments(query),
                Postulacion.find(query,
                     {usuario:1, msg:1}
                    )     
                                    // .populate('usuario',['user_name'])
                    .populate('usuariojoven_id',{password:0, __v:0})

            ]);
    
            if (!bolsa_trabajo || !bolsa_trabajo.estado) {
                return  res.status(401).json({
                msg: `La bolsa_trabajo: ${id}, no existe`
                });        
            }
    
        return res.json({
            'bolsa_trabajo': bolsa_trabajo.titulo,
            // 'bolsa_trabajo': bolsa_trabajo.titulo,
            total,
            // results:(carreras) ? [carreras] :[],
            results:postulados,
        });    
    }
    
    const buscarBolsasPorPostulados=async(id= '', res= response, estatus='todos')=>{
    
    // const query={estado:true, usuariojoven_id:id};
    




    let query;


switch (estatus) {
    case 'pendientes':
        query={estado:true, usuariojoven_id:id, estatus:1};
        
        break;
    case 'aceptadas':
        query={estado:true, usuariojoven_id:id, estatus:2};
        
        break;
    case 'rechazadas':
        query={estado:true, usuariojoven_id:id, estatus:3};
        
        break;

    default:
        query={estado:true, usuariojoven_id:id};

        break;
}





        const [postulado, total, bolsas_trabajo]= await Promise.all( [
                Usuario.findById(id),
                Postulacion.countDocuments(query),
                Postulacion.find(query,
                     {usuariojoven_id:0}
                     ) 

                                    // .populate('taller',['titulo']) 
                                    .populate(
                                        {
                                            path: 'bolsa_id',
                                            select:{__v:false, },
                                            populate:[
                                                {
                                                    path: 'usuario_id',
                                                    select:{__v:false, password: false },
                                                },
                                                {
                                                    path: 'categoriabolsa_id',
                                                    select:{__v:false,  },
                                                    populate:{
                                                        path :'usuario_id',
                                                        select:{__v:false, password:false, } 
                                                    }
                                                },
                                                {
                                                    path: 'estado_id',
                                                    select:{__v:false,  },
                                                    populate:{
                                                        path :'usuario_id',
                                                        select:{__v:false, password:false, } 
                                                    }
                                                },
                                                {
                                                    path: 'municipio_id',
                                                    select:{__v:false, },
                                                    populate:
                                                         [      
                                                        {
                                                        path: 'usuario_id',
                                                        select:{__v:false, password: false},
                                                        },
                                                        {
                                                        path: 'estado_id',
                                                        select:{__v:false},
                                                        populate:{
                                                            path :'usuario_id',
                                                            select:{__v:false, password:false}                       
                                                        }           
                                                                }
                                                ]
                                                },
                                                {
                                                    path: 'externo_id',
                                                    select:{__v:false, },
                                                    populate:
                                                   [ 
                                                    {
                                                        path :'usuario_id',
                                                        select:{__v:false, password:false, }                       
                                                    }, 
                                                    {
                                                        path :'titularempresa_id',
                                                        select:{__v:false,}        
                                                        ,                        populate:{
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
                                                
                                                ],          
                                            }
                                            ]
                                        },
                                    )                               
            ]);
    
            if (!postulado || !postulado.estado) {
                return res.status(401).json({
                msg: `El usuario ${id}, no existe`
                });        
            }
    
        return res.json({
            // 'usuario': usuario.user_name,
            'postulado': postulado.user_name,
            total,
            results:bolsas_trabajo,
        });    
    }
    
    
    


    
    const buscarExistenciaPostulacion=async(id= '', res= response, bolsa='')=>{
        

        
        if (bolsa==null ||bolsa=='') {
            return  res.status(401).json({
                msg: `La bolsa de trabajo es necesaria`
            }); 
            
        }else{
        const esMongoID = ObjectId.isValid( bolsa );
     if (!esMongoID) {
        return  res.status(401).json({
            msg: `la bolsa de trabajo: ${bolsa} no es válida`
    }); 
     }


       const bolsaDb = await BolsaTrabajo.findById(bolsa);

        if (!bolsaDb || !bolsaDb.estado) {
            return  res.status(401).json({
                msg: `El La bolsa ${bolsa } no existe`
        }); 
        }

    }
   const  query={estado:true, usuariojoven_id:id,  bolsa_id:bolsa};
    
        const [usuario, postulacion]= await Promise.all( [
                Usuario.findById(id),
                Postulacion.findOne(query) 
                 
                // .populate({
                //     path: 'taller',
                //     select:{__v:false, },
                //     populate:{
                //         path :'usuario',
                //         select:{__v:false, password:false, }  
                //              }           }),       
        ]);
    
            if (!usuario || !usuario.estado) {
                return res.status(401).json({
                msg: `El usuario ${id}, no existe`
                });        
            }



let  postulacion_id ='null';
if(postulacion){
    postulacion_id= postulacion._id
}
        return res.json({
            postulacion_id
        });    
    }
    
    
    





module.exports={
        obtenerPostulaciones,
        obtenerPostulacion,
          crearPostulacion,
          actualizarPostulacion,
       eliminarPostulacion,
       buscarRelacion
}



