const { response } = require('express');
const { CatMunicipio } = require('../models')

const obtenerCatMunicipios = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, municipios ] = await Promise.all([
        CatMunicipio.countDocuments(query),
        CatMunicipio.find(query)
        .sort({fecha_registro:-1})
            .populate('usuario_id', {password:0, __v:0})
            .populate(
                [
                    {
                        path: 'estado_id',
                        select:{__v:false},
                        populate:{
                            path :'usuario_id',
                            select:{__v:false, password:false}                       
                        }           
                }
                ]
            )


            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        municipios
    });
}

const obtenerCatMunicipio = async(req, res = response ) => {

    const { id } = req.params;
    const municipio = await CatMunicipio.findById( id )
    .populate('usuario_id', {password:0, __v:0})

    .populate(
        [
            {
                path: 'estado_id',
                select:{__v:false},
                populate:{
                    path :'usuario_id',
                    select:{__v:false, password:false}                       
                }           
        }
        ]
    );

    res.json( municipio );

}

const crearCatMunicipio = async(req, res = response ) => {
    const fecha_registro = Date.now();

   const { municipio, estado_id}=req.body;



    // Generar la data a guardar
    const data = {
        "municipio":municipio.toUpperCase().trim(),
        estado_id,
        fecha_registro,
        usuario_id: req.usuario._id
    }
   

    
    const catMunicipio = new CatMunicipio( data );
    // Guardar DB
    await catMunicipio.save();

    res.status(201).json(catMunicipio);

}

const actualizarCatMunicipio = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario_id, ...data } = req.body;

    data.municipio  = data.municipio.toUpperCase().trim();
    // data.usuario_id = req.usuario._id;



    const municipio = await CatMunicipio.findByIdAndUpdate(id, data, { new: true });

    res.json( municipio);

}

const borrarCatMunicipio = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();



    const { id } = req.params;



    const catMunicipioBorrado = await CatMunicipio.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true });

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
    res.json( catMunicipioBorrado );
}




module.exports = {
    obtenerCatMunicipios,
    crearCatMunicipio,
    obtenerCatMunicipio,
    actualizarCatMunicipio,
    borrarCatMunicipio,
}