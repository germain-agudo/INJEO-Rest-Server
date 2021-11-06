const {
    response
} = require('express');
const {
    CatRazonS, Externo
} = require('../models/index')

const obtenerCatRazonesSociales = async (req, res = response) => {

    const {
        limite = 5, desde = 0
    } = req.query;
    const query = {
        estado: true
    };

    const [total, razones_sociales] = await Promise.all([
        CatRazonS.countDocuments(query),
        CatRazonS.find(query)
        .sort({
            fecha_registro: -1
        })
        .populate('usuario_id', {
            password: 0,
            __v: 0
        })
        .populate(
            [
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



        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        razones_sociales
    });
}

const obtenerCatRazonSocial = async (req, res = response) => {

    const {
        id
    } = req.params;
    const razon_social = await CatRazonS.findById(id)
        .populate('usuario_id', {
            password: 0,
            __v: 0
        })
        .populate(
            [
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

    res.json(razon_social);

}

const crearCatRazonSocial = async (req, res = response) => {
    const fecha_registro = Date.now();

    const {
        razon_social,
        usuario_empresa_id
    } = req.body;

    const externo = await Externo.findOne({usuario_id:usuario_empresa_id, estado:true})
    // Generar la data a guardar
    if (! externo) {
        return res.status(401).json({
            msg: `EL id ${usuario_empresa_id} No cuenta con los permisos necesarios - No es una empresa`
        });  
    }

    const data = {
        razon_social: razon_social.toUpperCase().trim(),
        externo_id : externo._id,
        fecha_registro,

        usuario_id: req.usuario._id
    }

    const catRazonSocial = new CatRazonS(data);
    // Guardar DB
    await catRazonSocial.save();
    res.status(201).json(catRazonSocial);

}

const actualizarCatRazonSocial = async (req, res = response) => {

    const {   id  } = req.params;
    const {   razon_social } = req.body;

    const razonSocialDB = await CatRazonS.findById(id);

    let permiso = true;
    (razonSocialDB.usuario_id.equals(req.usuario._id) || req.usuario.rol === 'ADMIN_ROLE') ? permiso = true: permiso = false;

    if (!permiso) {
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        });
    }


    const catRazonSocialDb = await CatRazonS.findOne({    
        razon_social : razon_social.toUpperCase().trim(),
        estado: true})
    if (catRazonSocialDb && catRazonSocialDb._id != id) {
        return res.status(401).json({
                msg: `La razon social: ${ catRazonSocialDb.razon_social }, ya existe`
    
        })
    }
    
    



    const data = {
        razon_social: razon_social.toUpperCase().trim(),

    }

    const razon_social_db = await CatRazonS.findByIdAndUpdate(id, data, {
        new: true
    });
    res.json(razon_social_db);

}

const eliminarCatRazonSocial = async (req, res = response) => {
    const fecha_eliminacion = Date.now();

    const {  id } = req.params;

    const razonSocialDB = await CatRazonS.findById(id);
    let permiso = true;
    (razonSocialDB.usuario_id.equals(req.usuario._id) || req.usuario.rol === 'ADMIN_ROLE') ? permiso = true: permiso = false;
    if (!permiso) {
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        });
    }


    const catRazonSocialBorrado = await CatRazonS.findByIdAndUpdate(id, {
        estado: false,
        fecha_eliminacion
    }, {
        new: true
    });




    // const [convocatoriaBorrada,convocatoriaImagen]= await Promise.all([
    //     Convocatoria.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true }),

    //     ConvocatoriaImg.find({ convocatoria_id:id, estado:true
    //             }).then((cI)=>{
    //                 if (cI.length>0) {
    //                     cI.forEach(async (i)=>{ 
    //                         await ConvocatoriaImg.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
    //                     })
    //                 }
    //             })

    // ])
    res.json(catRazonSocialBorrado);
}




module.exports = {
    obtenerCatRazonesSociales,
    crearCatRazonSocial,
    obtenerCatRazonSocial,
    actualizarCatRazonSocial,
    eliminarCatRazonSocial,
}