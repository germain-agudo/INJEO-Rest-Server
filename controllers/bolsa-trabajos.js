const {response, request} = require('express');
 
const {BolsaTrabajo, Externo}= require('../models/index');

/**
 *  Obtener Todas Las Bolsa De Trabajo
 */
 const obtenerBolsas = async(req, res= response)=>{
 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, bolsas] = await Promise.all([
        BolsaTrabajo.countDocuments(query),
        BolsaTrabajo.find(query)
                        .sort({fecha_registro:-1})
                        // .populate('usuario_id',['user_name'])
                        // .populate('usuario_id',{password:0, __v:0})
                        .populate(
                            [
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
                        )



                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        bolsas
    });

    }

/**
 *  Obtener Una Bolsa De Trabajo
 */
const obtenerBolsa = async(req, res= response)=>{
    const {id}= req.params;
    const bolsaTrabajo = await BolsaTrabajo.findById(id)
                                        // .populate('usuario_id',['user_name']);
                                        // .populate('usuario_id',{password:0, __v:0})
                                        .populate(
                                            [
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
                                        )
                                

res.json(bolsaTrabajo);   
}

/**
 *  Crear Una Bolsa de Trabajo
 */
const crearBolsa = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {
        titulo, 
        descripcion, 
        requisitos, 
        enlace,
    
        usuario_empresa_id,
        fecha_inicio,
        salario,
        beneficios,
        modalidad,
        horario,
        categoriabolsa_id,
        estado_id,
        municipio_id,
    }= req.body;   

  const externo = await Externo.findOne({usuario_id:usuario_empresa_id, estado:true})
    // Generar la data a guardar
    if (! externo) {
        return res.status(401).json({
            msg: `EL id ${usuario_empresa_id} No cuenta con los permisos necesarios - No es una empresa`
        });  
    }

    const data = {

        titulo:titulo.toUpperCase().trim(),
        descripcion:descripcion.trim(),
        requisitos:requisitos.trim(),
        enlace:enlace.trim(),
        usuario_id: req.usuario._id,
        fecha_registro,
        
        externo_id : externo._id,
        fecha_inicio,
        salario,
        beneficios,
        modalidad,
        horario,
        categoriabolsa_id,
        estado_id,
        municipio_id,
    }
    
    const bolsaTrabajo = new BolsaTrabajo(data);
await bolsaTrabajo.save();      
    res.status(201).json(bolsaTrabajo);    
}

/**
 *  Actualizar Una Bolsa de Trabajo
 */
const actualizarBolsa = async(req, res= response)=>{

    const {id }= req.params;   
const {
    titulo, 
    descripcion, 
    requisitos, 
    enlace ,

    fecha_inicio,
    salario,
    beneficios,
    modalidad,
    horario,
    categoriabolsa_id,
    estado_id,
    municipio_id,

}= req.body;

const bolsaTrabajoDB = await  BolsaTrabajo.findById(id);

let permiso = true;
(bolsaTrabajoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const data = {
    titulo:titulo.toUpperCase(),
    descripcion:descripcion.trim(),
    requisitos:requisitos.trim(),
    enlace:enlace.trim(),

    fecha_inicio,
    salario,
    beneficios,
    modalidad,
    horario,
    categoriabolsa_id,
    estado_id,
    municipio_id,
}

const bolsaTrabajo = await BolsaTrabajo.findByIdAndUpdate(id,data, {new:true});
res.json(bolsaTrabajo);   
}

/**
 *  Eliminar Una Bolsa de Trabajo
 */
const eliminarBolsa = async(req, res= response)=>{

    const fecha_eliminacion = Date.now();

const {id} = req.params;
const bolsaTrabajoDB = await  BolsaTrabajo.findById(id);
let permiso = true;
(bolsaTrabajoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
const bolsaTrabajo = await BolsaTrabajo.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(bolsaTrabajo); 
    
}




module.exports={
    obtenerBolsa,
    obtenerBolsas,
    crearBolsa,
    actualizarBolsa,
    eliminarBolsa,
}



