const {response, request} = require('express');

const {Postulacion, BolsaTrabajo, Usuario}= require('../models/index');

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
    const { bolsa_id, curriculum_url }= req.body;   

const postulacionDB = await Postulacion.findOne({ bolsa_id, usuariojoven_id: req.usuario._id, estado:true})

if (postulacionDB) {
    return res.status(401).json({
        msg: `Actualmente eL usuario ${req.usuario._id}, ya está postulado en la oferta:${bolsa_id} `
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
    const {   id  } = req.params;
    const {   curriculum_url } = req.body;
    const postulacionDB = await  Postulacion.findById(id);
    let permiso = true;
    (postulacionDB.usuariojoven_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }
// console.log(curriculum_url);
  
    const postulacion_db = await Postulacion.findByIdAndUpdate(id, {curriculum_url}, {
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
    const {id, coleccion}= req.params;

    switch (coleccion) {
        case 'bolsas':
               buscarPostuladosPorBolsa(id, res);
             
            break;
    
        case 'postulados':
               buscarBolsasPorPostulados(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    



    const buscarPostuladosPorBolsa=async(id= '', res= response)=>{
    
    const query={estado:true, bolsa_id :id};
        const [bolsa_trabajo,total, postulados]= await Promise.all( [
                BolsaTrabajo.findById(id),
                Postulacion.countDocuments(query),
                Postulacion.find({estado:true, bolsa_id:id},
                     {usuario:1,}
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
    
    const buscarBolsasPorPostulados=async(id= '', res= response)=>{
    
    const query={estado:true, usuariojoven_id:id};
    
        const [postulado, total, bolsas_trabajo]= await Promise.all( [
                Usuario.findById(id),
                Postulacion.countDocuments(query),
                Postulacion.find({estado:true, usuariojoven_id:id},
                     {usuariojoven_id:0,}
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
    
    
    





module.exports={
        obtenerPostulaciones,
        obtenerPostulacion,
          crearPostulacion,
          actualizarPostulacion,
       eliminarPostulacion,
       buscarRelacion
}



